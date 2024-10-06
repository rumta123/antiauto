import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { CarCatalogUpdateModule } from './car-catalog-update/car-catalog.module';
import { CitiesUpdateModule } from './cities-update/cities.module';
const { combine, timestamp, json, simple, align, printf } = winston.format;
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
      synchronize: false,
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
        new winston.transports.Console({level:'info'}),
        new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
        //new winston.transports.File({ filename: 'log/combined.log' }),
      ],
    }),
    CarCatalogUpdateModule,
    CitiesUpdateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
