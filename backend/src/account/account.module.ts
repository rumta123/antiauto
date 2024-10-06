import { Module, forwardRef } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from 'src/_queue/queue.module';
import { RedisAppModule } from 'src/_redis/redis.module';
import { Accounts } from './entities/accounts.entity';
import { AccountsTypes } from './entities/accounts_types.entity';
import { AccountsStatuses } from './entities/accounts_statuses.entity';
import { AccountsStatusesMap } from './entities/accounts_statuses_map.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts,AccountsTypes,AccountsStatuses,AccountsStatusesMap]),
    forwardRef(() => QueueModule),
    RedisAppModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
