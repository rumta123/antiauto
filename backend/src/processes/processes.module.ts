import { forwardRef, Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Processes } from './entities/processes.entity';
import { ProcessesProvider } from './providers/processes.provider';
import { QueueModule } from 'src/_queue/queue.module';
import { ProcessesTypes } from './entities/processes_types.entity';
import { ProcessesTypesProvider } from './providers/processes_types.provider';
import { ProcessesMessagesProvider } from './providers/processes_messages.provider';
import { ProcessesMessages } from './entities/processes_messages.entity';
import { ProcessesDecisions } from './entities/processes_decisions.entity';
import { ProcessesDecisionsProvider } from './providers/processes_decisions.provider';
import { OffersModule } from 'src/offers/offers.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Processes, ProcessesTypes, ProcessesMessages, ProcessesDecisions]),
    QueueModule,
    forwardRef(() => OffersModule)
  ],
  controllers: [ProcessesController],
  providers: [ProcessesService, ProcessesProvider, ProcessesTypesProvider, ProcessesMessagesProvider, ProcessesDecisionsProvider],
  exports: [ProcessesProvider, ProcessesTypesProvider]

})
export class ProcessesModule { }
