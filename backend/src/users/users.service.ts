import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';



@Injectable()
export class UsersService {
    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        @InjectRepository(Users)
        private usersRepository: Repository<Users>,

        private accountService: AccountService,

    ) {
        this.logger = winstonLogger.child({ service: UsersService.name });
    }


    async findByEmail(email: string) {
        return await this.usersRepository.findOne({ where: { email }, relations: { account: { account_type: true } } })
    }

    findById(id: string) {
        return this.usersRepository.findOne({ where: { id }, relations: { account: { account_type: true } } })
    }

    async create(email: string, hash: string, salt: string, accountType: string, owner_id?: string) {
        const newUser = this.usersRepository.create({
            email,
            hash,
            salt,
            createdBy: owner_id ? owner_id : process.env.DATABASE_USER,
            owner: owner_id ? { id: owner_id } : undefined
        });
        const user = await this.usersRepository.save(newUser);
        this.logger.info(`create: User ${email} created`)
        // await this.accountService.create(user.id, accountType);
        return user;
    }

    async setEmailVerified(email: string) {
        const user = await this.findByEmail(email)
        if (!user) {
            throw new BadRequestException("Пользователь не найден")
        }
        user.isEmailVerified = true
        await this.usersRepository.save(user)
        return user;
    }

    async setNewPassword(id: string, hash: string, salt: string) {
        const user = await this.findById(id);
        if (!user) {
            throw new BadRequestException("Пользователь не найден")
        }
        user.hash = hash;
        user.salt = salt;
        await this.usersRepository.save(user);
        return user;
    }

    async findOwned(owner_id: string) {
        return await this.usersRepository.find({ where: { owner: { id: owner_id } } })
    }
}
