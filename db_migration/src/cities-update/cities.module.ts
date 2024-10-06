import { Module } from '@nestjs/common';
import { CitiesUpdateController } from './cities.controller';
import { CitiesUpdateService } from './cities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from './entities/cities.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Cities])],
  controllers: [CitiesUpdateController],
  providers: [CitiesUpdateService]
})
export class CitiesUpdateModule { }