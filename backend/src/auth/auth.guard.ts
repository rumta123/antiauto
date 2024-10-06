import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,

    @InjectRedis()
    private readonly redis: Redis,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest() as Request
    const token = req.cookies[CookieService.tokenKey];

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const sessionInfo = this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })
      const redisTokenUserId = await this.redis.get(`accessToken:${token}`)

      if (!redisTokenUserId) throw new UnauthorizedException()

      req['session'] = sessionInfo;
    } catch {
      throw new UnauthorizedException()
    }
    return true;
  }
}
