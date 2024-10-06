import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { PrismaClient } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
// import { DbService } from './db/db.service';

class HelloWorldDto {
  @ApiProperty()
  message: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    // private dbService: DbService
  ) {}

  @Get()
  async getHello(): Promise<HelloWorldDto> {
    // const users = await this.dbService.user.findMany({})
    // console.log(users)
    return {message: this.appService.getHello()};
  }
}
