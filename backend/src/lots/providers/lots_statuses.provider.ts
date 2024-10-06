import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LotsStatusesMap } from "../entities/lots_statuses_map.entity";
import { LotsStatuses } from "../entities/lots_statuses.entity";


@Injectable()
export class LotsStatusesProvider {

    constructor(
        @InjectRepository(LotsStatusesMap)
        private lotsStatusesMapRepository: Repository<LotsStatusesMap>,
        @InjectRepository(LotsStatuses)
        private lotsStatusesRepository: Repository<LotsStatuses>,
    ) {

    }

    async create(userId: string, lotId: string, statusName: string) {
        const status = await this.lotsStatusesRepository.findOne({ where: { name: statusName } });
        if (!status) {
            throw new Error(`Статус "${statusName}" не найден`)
        }
        const createdStatusMap = await this.lotsStatusesMapRepository.create({
            lot: { id: lotId },
            status: { id: status.id },
            createdBy: userId
        })
        const savedStatusMap = await this.lotsStatusesMapRepository.save(createdStatusMap);
        return savedStatusMap;
    }

    async getActualStatus(lotId: string) {
        const status = await this.lotsStatusesMapRepository.findOne({
            where: {
                lot_id: lotId
            },
            relations: { status: true },
            order: { createdAt: "DESC" }
        })
        return status;
    }
}