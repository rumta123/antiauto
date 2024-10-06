import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => AccountModule)],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
