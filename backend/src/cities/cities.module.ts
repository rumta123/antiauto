import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from './entities/cities.entity';
import { CitiesProvider } from './providers/cities.provider';

@Module({
    imports: [TypeOrmModule.forFeature([
        Cities
    ])],
    controllers: [CitiesController],
    providers: [CitiesService, CitiesProvider],
    exports: [CitiesProvider]
})
export class CitiesModule { }
