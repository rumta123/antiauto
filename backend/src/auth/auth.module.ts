import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { CookieService } from './cookie.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

import { QueueModule } from 'src/_queue/queue.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    forwardRef(()=>UsersModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    }),
    QueueModule,
    forwardRef(()=>AccountModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, CookieService],
  exports: [AuthService]
})
export class AuthModule { }
