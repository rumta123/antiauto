import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        RedisModule.forRoot({
            type: 'single',
            url: `redis://redis:${+(process.env.REDIS_PORT || 6379)}`,
          }),
    ],
    exports: [RedisModule],
})
export class RedisAppModule { }