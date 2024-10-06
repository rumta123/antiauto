import { Process, Processor } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import { Job } from "bull";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { UsersService } from "src/users/users.service";
import { Logger } from "winston";
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from "ioredis";

@Processor('auth')
export class AuthProcessor {
    private readonly logger: Logger;

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        @InjectRedis()
        private readonly redis: Redis,
        
        private usersService: UsersService,
    ) { 
        this.logger = winstonLogger.child({ service: AuthProcessor.name });
    }

    @Process('send-email-verify-code')
    async emailVerify(job: Job) {

        const { email, code } = job.data;
        
        console.log(email, 'code ',code)
        // TODO: send code to email service
        this.logger.debug(`emailVerify: code to ${email} was sent`)
    }
    
    @Process('sign-up-customer')
    async userCreate(job: Job){

        const { email, userId, accessToken } = job.data;

        //const newUser = await this.usersService.create(email, hash, salt);


        await this.redis.set(`accessToken:${accessToken}`, userId, "EX", 24*60*60);
        
        this.logger.debug(`userCreate: email ${email} registered`)

        // TODO: send congrats email to queue
    }

    @Process('sign-in')
    async setTokenToRedis(job: Job){
        const { accessToken, userId } = job.data;
        await this.redis.set(`accessToken:${accessToken}`, userId, "EX", 24*60*60);
        this.logger.debug(`setTokenToRedis: set token for userId ${userId} `)
    }

   
}