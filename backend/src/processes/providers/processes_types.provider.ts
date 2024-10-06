import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProcessesTypes } from "../entities/processes_types.entity";
import { BadRequestException } from "@nestjs/common";

export class ProcessesTypesProvider {

    constructor(

        @InjectRepository(ProcessesTypes)
        private readonly processesTypesRepository: Repository<ProcessesTypes>,
    ) { }

    async get(processTypeName: string = 'chat') {

        const processType = await this.processesTypesRepository.findOne({ where: { name: processTypeName } });
        if (!processType) {
            throw new BadRequestException(`Process type ${processTypeName} not found`);
        }

        return processType
    }
}

