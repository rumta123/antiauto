
import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';


import { AuthProcessor } from 'src/_queue/job/auth.processor';
import { UsersModule } from 'src/users/users.module';
import { RedisAppModule } from 'src/_redis/redis.module';
import { AccountProcessor } from './job/account.processor';


@Module({
    imports: [
        forwardRef(() => UsersModule),
        RedisAppModule,
        BullModule.forRootAsync({
            useFactory: async () => ({
                redis: {
                    host: 'redis',
                    port: +(process.env.REDIS_PORT || 6379),
                    db: 0
                },
            })
        }),
        // BullModule.registerQueue({ name: 'send-email' }),
        BullModule.registerQueue({ name: 'auth' }),
        BullModule.registerQueue({ name: 'account' }),
    ],
    providers: [AuthProcessor, AccountProcessor],
    exports: [BullModule, AuthProcessor, AccountProcessor],
})
export class QueueModule { }