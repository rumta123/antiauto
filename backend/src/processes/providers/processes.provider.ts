import { IsNull, Repository } from "typeorm";
import { Processes } from "../entities/processes.entity";
import { GetSessionInfoDto } from "src/auth/dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ProcessesTypes } from "../entities/processes_types.entity";

export class ProcessesProvider {

    constructor(

        @InjectRepository(Processes)
        private readonly processesRepository: Repository<Processes>,

    ) { }

    async create(session: GetSessionInfoDto, {processType, lotId, offerId, dealersCarId}: {processType: ProcessesTypes, lotId?: string, offerId?: string, dealersCarId?: string}) {
        const newProcess = this.processesRepository.create({
            process_type: { id: processType.id },
            createdBy: session.id,
            customer: { id: session.id },
            is_decision_required: processType.name !== 'chat',
            is_process_closed: false,
            lot: { id: lotId },
            offer: { id: offerId },
            dealers_car: { id: dealersCarId }
        })
        await this.processesRepository.save(newProcess)
        return newProcess
    }

    async getById(session: GetSessionInfoDto, processId: string) {
        const process = await this.processesRepository.findOne({
            where: { id: processId },
            relations: ['process_type']
        })
        return process
    }

    async getOwnById(session: GetSessionInfoDto, processId: string) {
        const process = await this.processesRepository.findOne({
            where: { id: processId, customer_id: session.id },
            relations: ['process_type']
        })
        return process
    }

    async getByType(session: GetSessionInfoDto, processType: ProcessesTypes) {
        const process = await this.processesRepository.findOne({
            where: { process_type_id: processType.id, customer_id: session.id, is_process_closed: false },
            relations: ['process_type']
        })
        return process
    }

    async getProcessesForServiceDesk(session: GetSessionInfoDto, skip: number, take: number, processType?: string) {

        const queryBuilder = this.processesRepository.createQueryBuilder("process")
            .leftJoinAndSelect("process.process_type", "process_type")
            .leftJoinAndSelect("process.messages", "messages")
            .orderBy("messages.createdAt", "DESC")
            .skip(skip)
            .take(take);

        if (processType) {
            queryBuilder.andWhere("process_type.name = :processTypeName", { processTypeName: processType });
        }

        const processes = await queryBuilder.getMany();

        return processes;
    }

    async getProcessesForUser(session: GetSessionInfoDto, skip: number, take: number, processType?: string) {
        const queryBuilder = this.processesRepository.createQueryBuilder("process")
            .leftJoinAndSelect("process.process_type", "process_type")
            .leftJoinAndSelect("process.messages", "messages")
            .where("process.customer_id = :customerId", { customerId: session.id })
            .orderBy("messages.createdAt", "DESC")
            .skip(skip)
            .take(take)

        if (processType) {
            queryBuilder.andWhere("process_type.name = :processTypeName", { processTypeName: processType });
        }

        const processes = await queryBuilder.getMany();
        return processes;

    }

    async update(session: GetSessionInfoDto, processId: string, {decisionId}: {decisionId?: string}) {
        const process = await this.getById(session, processId);
        if (!process) {
            throw new Error('Process not found');
        }
        if (decisionId) {
            process.decision_id = decisionId;
            process.is_process_closed = true;
        }
        await this.processesRepository.save(process);
        return process;
    }

}

