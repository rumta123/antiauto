import { Process, Processor } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import { Job } from "bull";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { UsersService } from "src/users/users.service";
import { Logger } from "winston";
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from "ioredis";

@Processor('account')
export class AccountProcessor {
    private readonly logger: Logger;

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        @InjectRedis()
        private readonly redis: Redis,
        
    ) { 
        this.logger = winstonLogger.child({ service: AccountProcessor.name });
    }
    
    @Process('send-phone-verify-code')
    async phoneVerify(job: Job) {
        const { phone, code } = job.data;
        console.log('phoneVerify',phone,' code ',code)
        
        // TODO: send code to sms service
        this.logger.debug(`phoneVerify: code to ${phone} was sent`)
    }



}