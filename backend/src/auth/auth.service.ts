import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/entities/users.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AuthResDto, GetSessionInfoDto } from './dto';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AuthService {
    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private usersService: UsersService,
        private accountService: AccountService,
        private passwordService: PasswordService,
        private jwtService: JwtService,

        @InjectRedis()
        private readonly redis: Redis,

        @InjectQueue('auth')
        private authQueue: Queue
    ) {
        this.logger = winstonLogger.child({ service: AuthService.name });

    }
    private randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min)
    private async getCode(email: string) {
        const code = this.randomBetween(123456, 987654);
        await this.redis.set(`verificationCode:${email}`, code, "EX", 5 * 60); //5 minutes
        return code;
    }
    private toAuthResDto(user: Users): AuthResDto {
        return {
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    }

    async signUp(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)

        if (user) {
            this.logger.warn(`signUp: email ${email} уже зарегистрирован`, user)
            throw new BadRequestException({ type: 'email-exist', message: "Email уже зарегистрирован" })
        }

        const salt = this.passwordService.getSalt();
        const hash = this.passwordService.getHash(password, salt);

        const newUser = await this.usersService.create(email, hash, salt, 'customer');
        const newAccount = await await this.accountService.create(newUser.id, 'customer');

        const code = await this.getCode(email);
        try {
            await this.authQueue.add('send-email-verify-code', {
                email,
                code
            })
        } catch (error) {
            this.logger.error('Ошибка при добавлении задачи в очередь send-email-verify-code: ', error);
        }
        return this.toAuthResDto(newUser)
    }

    async signUpSub(session: GetSessionInfoDto, email: string, password: string, name: string, address: string, phone: string, comment: string) {
        const user = await this.usersService.findByEmail(email)

        if (user) {
            this.logger.warn(`signUp: email ${email} не зарегистрирован`)
            throw new BadRequestException({ type: 'email-exist', message: "Email уже зарегистрирован" })
        }
        if (session.type !== ('seller' || 'root')) {
            throw new ForbiddenException
        }

        const salt = this.passwordService.getSalt();
        const hash = this.passwordService.getHash(password, salt);
        const subAccountType = session.type === 'seller' ? 'seller' : 'service_desk';

        const newUser = await this.usersService.create(email, hash, salt, subAccountType, session.id);
        const newAccount = await this.accountService.create(newUser.id, subAccountType, name, address, phone, comment);

        const code = await this.getCode(email);
        try {
            await this.authQueue.add('send-email-verify-code', {
                email,
                code
            })
        } catch (error) {
            this.logger.error('Ошибка при добавлении задачи в очередь send-email-verify-code: ', error);
        }
        return this.toAuthResDto(newUser)
    }

    async signIn(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)

        if (!user) {
            throw new UnauthorizedException()
        }
        if (!user.isEmailVerified) {
            const code = await this.getCode(email);
            try {
                await this.authQueue.add('send-email-verify-code', {
                    email,
                    code
                })
            } catch (error) {
                this.logger.error('Ошибка при добавлении задачи в очередь send-email-verify-code: ', error);
            }
            return { user: this.toAuthResDto(user) }
        }

        const hash = this.passwordService.getHash(password, user.salt);
        if (hash !== user.hash) {
            throw new UnauthorizedException()
        }

        const accessToken = await this.jwtService.signAsync({
            email: user.email,
            id: user.id,
            type: user.account.account_type.name
        });

        await this.authQueue.add('sign-in', {
            accessToken,
            userId: user.id
        })

        this.logger.info(`signIn: user with email ${email} signed in`)
        return { accessToken, user: this.toAuthResDto(user) };
    }

    async sendCode(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException("Email не зарегистрирован")
        }
        const code = await this.getCode(email);
        try {
            await this.authQueue.add('send-email-verify-code', {
                email,
                code
            })
        } catch (error) {
            this.logger.error('Ошибка при добавлении задачи в очередь send-email-verify-code: ', error);
        }
        return this.toAuthResDto(user)
    }

    async verifyEmail(email: string, code: string) {
        const user = await this.usersService.findByEmail(email)

        if (!user) {
            throw new UnauthorizedException()
        }

        const storedCode = await this.redis.get(`verificationCode:${email}`);
        if (!storedCode) {
            this.logger.warn(`verifyEmail: Код устарел для ${user.id} `)
            throw new BadRequestException('Код устарел');
        } else if (storedCode !== code) {
            this.logger.warn(`verifyEmail: Неверный код для ${user.id} `)
            throw new BadRequestException('Неверный код');
        } else if (storedCode === code) {
            this.logger.info(`verifyEmail: Код для ${user.id} успешно проверен!`)
            await this.usersService.setEmailVerified(email)
        }

        const accessToken = await this.jwtService.signAsync({
            email: user.email,
            id: user.id,
            type: user.account.account_type.name
        });

        await this.authQueue.add('sign-in', {
            accessToken,
            userId: user.id
        })

        this.logger.info(`signIn: user with email ${email} signed in`)
        return { accessToken, user: this.toAuthResDto(user) };
    }

    async resetPassword(email: string) {
        const user = await this.usersService.findByEmail(email)
        if (!user) {
            this.logger.warn(`resetPassword: email ${email} не существует`)
            throw new BadRequestException({ type: 'email-exist', message: "Email не зарегистрирован" })
        }

        // TODO: создать токен для сброса пароля, сохранить его в базу, отправить письмо
    }

    async getUserFromAuthToken(token: string): Promise<Users | null> {
        try {
            if (!token || !token.length) {
                this.logger.warn(`getUserFromAuthToken: Invalid token: Token not provided`)
                throw new BadRequestException("Invalid token: Token not provided");
            }

            const payload = await this.jwtService.verify(token);
            const userId = payload.id;

            if (!userId) {
                this.logger.warn(`getUserFromAuthToken: Invalid token: User ID not found`)
                throw new BadRequestException("Invalid token: User ID not found");
            }

            const user = await this.usersService.findById(userId);

            if (!user) {
                this.logger.warn(`getUserFromAuthToken: User not found with provided ID`)
                throw new BadRequestException("User not found with provided ID");
            }

            return user;
        } catch (error) {
            this.logger.error(`getUserFromAuthToken: catch error: ${error}`)
            return null;
        }
    }

    async changePassword(email: string, password: string, newPassword: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException("Email не зарегистрирован")
        }
        const hash = this.passwordService.getHash(password, user.salt);
        if (hash !== user.hash) {
            throw new UnauthorizedException()
        }
        const newSalt = this.passwordService.getSalt();
        const newHash = this.passwordService.getHash(newPassword, newSalt);
        const updatedUser = await this.usersService.setNewPassword(user.id, newHash, newSalt);
        const accessToken = await this.jwtService.signAsync({
            email: updatedUser.email,
            id: updatedUser.id,
            type: updatedUser.account.account_type.name
        })
        await this.authQueue.add('sign-in', {
            accessToken,
            userId: user.id
        })
        return {
            accessToken: accessToken,
            user: this.toAuthResDto(updatedUser)
        }
    }

   
}

