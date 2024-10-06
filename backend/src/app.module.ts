import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { CarCatalogModule } from './car-catalog/car-catalog.module';
// import { ChatGateway } from './chat/chat.gateway';
// import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { QueueModule } from './_queue/queue.module';
import * as winston from 'winston';
import { RedisAppModule } from './_redis/redis.module';
import { CitiesModule } from './cities/cities.module';
import { LotsModule } from './lots/lots.module';
import { DealersCarsModule } from './dealers_cars/dealers_cars.module';
import { OffersModule } from './offers/offers.module';
import { ProcessesModule } from './processes/processes.module';


const { combine, timestamp, align, printf } = winston.format;
const timezoned = () => {
  return new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/Moscow',
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    fractionalSecondDigits: 3
  });
}
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development' || process.env.COLD_START === 'true' ? true : false,
    }),
    WinstonModule.forRoot({
      exitOnError: false,
      format: combine(
        timestamp({
          format: timezoned
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: [${info.service}] ${info.message}`)
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'log/combined.log' }),
      ],
    }),
    QueueModule,
    RedisAppModule,
    AuthModule,
    UsersModule,
    AccountModule,
    CarCatalogModule,
    CitiesModule,
    LotsModule,
    DealersCarsModule,
    OffersModule,
    ProcessesModule,
    // ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, QueueModule, /* ChatGateway */],
})
export class AppModule { }
