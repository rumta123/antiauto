import { InjectRepository } from "@nestjs/typeorm";
import { ProcessesDecisions } from "../entities/processes_decisions.entity";
import { Repository } from "typeorm";

export class ProcessesDecisionsProvider {
    constructor(
        @InjectRepository(ProcessesDecisions)
        private processesDecisionsRepository: Repository<ProcessesDecisions>
    ) { }
    
    async getAll() {
        return await this.processesDecisionsRepository.find();
    }

    async get(id: string) {
        return await this.processesDecisionsRepository.findOneBy({ id });
    }
}

