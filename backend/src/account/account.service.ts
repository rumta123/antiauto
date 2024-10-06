import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AccountDto, PatchAccountDto, PatchAccountPhoneDto, PostAccountPhoneVerifyDto, SubAccountDto } from './dto';
import { Accounts } from './entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AccountsTypes } from './entities/accounts_types.entity';
import { GetSessionInfoDto } from 'src/auth/dto';


@Injectable()
export class AccountService {

    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        @InjectQueue('account')
        private accountQueue: Queue,

        @InjectRedis()
        private readonly redis: Redis,

        @InjectRepository(Accounts)
        private accountRepository: Repository<Accounts>,

        @InjectRepository(AccountsTypes)
        private accountTypesRepository: Repository<AccountsTypes>,
    ) {
        this.logger = winstonLogger.child({ service: AccountService.name });
    }

    async create(userId: string, accountType: string, name?: string, address?: string, phone?: string, comment?: string) {
        const accountTypeId = await this.accountTypesRepository.findOne({ where: { name: accountType } })
        const newAccount = this.accountRepository.create({
            owner: { id: userId },
            phone: phone ? phone : '',
            createdBy: userId,
            account_type_id: accountTypeId?.id,
            name,
            address,
            comment
        });
        await this.accountRepository.save(newAccount);
        this.logger.info(`create: Account for userId: ${userId} created`)
        return newAccount;
    }

    private toDto(account: Accounts): AccountDto {

        return {
            id: account.id,
            ownerId: account.owner.id,
            phone: account.phone,
            name: account.name,
            lastname: account.lastname,
            isPhoneVerified: account.isPhoneVerified,
            accountType: account.account_type.name
        };
    }

    async getAccount(userId: string) {
        const account = await this.accountRepository.findOne({
            where: { owner: { id: userId } },
            relations: {
                owner: true,
                account_type: true
            }
        });
        if (!account) {
            this.logger.warn(`getAccount: Account with userId: ${userId} not found`)
            throw new Error('Account not found');
        }
        return this.toDto(account);
    }

    async patchAccount(userId: string, patch: PatchAccountDto) {

        let account = await this.accountRepository.findOne({
            where: {
                owner: { id: userId },
                id:patch.id
            },
            relations: {
                owner: true,
                account_type: true
            }
        });
        if (!account) {
            account = await this.accountRepository.findOne({
                where: {
                    owner: { owner: { id: userId } },
                    id:patch.id
                },
                relations: {
                    owner: true,
                    account_type: true
                }
            });
        }
        if (!account) {
            this.logger.warn(`patchAccount: Account with userId: ${userId} not found`)
            throw new Error('Account not found');
        }
        account.updatedBy = userId;
        Object.assign(account, patch);
        const updatedAccount = await this.accountRepository.save(account);
        this.logger.info(`patchAccount: Account with userId: ${userId} was updated`)
        return this.toDto(updatedAccount);
    }

    private randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min)
    async patchAccountPhone(userId: string, patch: PatchAccountPhoneDto) {

        const account = await this.accountRepository.findOne({
            where: { owner: { id: userId } },
            relations: {
                owner: true,
                account_type: true
            }
        });
        if (!account) {
            this.logger.warn(`patchAccount: Account with userId: ${userId} not found`)
            throw new BadRequestException('Аккаунт не найден');
        }
        account.updatedBy = userId;

        if (account.phone === patch.phone) {
            return this.toDto(account);
        }
        account.isPhoneVerified = false;
        Object.assign(account, patch);
        const updatedAccount = await this.accountRepository.save(account);

        const code = this.randomBetween(123456, 987654);
        await this.redis.set(`verificationCode:${patch.phone}`, code, "EX", 3 * 60); //3 minutes
        try {
            await this.accountQueue.add('send-phone-verify-code', {
                phone: patch.phone,
                code
            })
        } catch (error) {
            this.logger.error('Ошибка при добавлении задачи в очередь send-phone-verify-code: ', error);
        }

        this.logger.info(`patchAccountPhone: Account phone for userId: ${userId} was updated`)
        return this.toDto(updatedAccount);
    }

    async postAccountPhoneVerify(userId: string, body: PostAccountPhoneVerifyDto): Promise<AccountDto> {
        const account = await this.accountRepository.findOne({
            where: { owner: { id: userId } },
            relations: {
                owner: true,
                account_type: true
            }
        });
        if (!account) {
            this.logger.warn(`postAccountPhoneVerify: Account with userId: ${userId} not found`)
            throw new Error('Аккаунт не найден');
        }
        const storedCode = await this.redis.get(`verificationCode:${body.phone}`);
        console.log('storedCode ', storedCode, ' / body.code ', body.code)
        if (!storedCode) {
            this.logger.warn(`postAccountPhoneVerify: Код устарел для ${userId} `)
            throw new Error('Код устарел');
        } else if (storedCode !== body.code) {
            this.logger.warn(`postAccountPhoneVerify: Неверный код для ${userId} `)
            throw new Error('Неверный код');
        } else if (storedCode === body.code) {
            this.logger.info(`postAccountPhoneVerify: Код для ${userId} успешно проверен!`)
            account.isPhoneVerified = true;
        }
        const updatedAccount = await this.accountRepository.save(account);

        return this.toDto(updatedAccount);
    }

    async getSubAccounts(session: GetSessionInfoDto) {
        const accounts = await this.accountRepository.find({
            where: {
                owner:
                    { owner: { id: session.id } }
            },
            relations: {
                owner: true,
                account_type: true
            }
        });
        return accounts.map(account => new SubAccountDto(account));
    }

}
