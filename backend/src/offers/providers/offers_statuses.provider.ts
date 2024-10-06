import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OffersStatusesMap } from "../entities/offers_statuses_map.entity";
import { OffersStatuses } from "../entities/offers_statuses.entity";

@Injectable()
export class OffersStatusesProvider {

    constructor(
        @InjectRepository(OffersStatusesMap)
        private offersStatusesMap: Repository<OffersStatusesMap>,
        @InjectRepository(OffersStatuses)
        private offersStatusesRepository: Repository<OffersStatuses>,
    ) {

    }

    async create(userId: string, offerId: string, statusName: string) {
        const status = await this.offersStatusesRepository.findOne({ where: { name: statusName } });
        if (!status) {
            throw new Error(`Статус "${statusName}" не найден`)
        }
        const createdStatusMap = await this.offersStatusesMap.create({
            offer: { id: offerId },
            status: { id: status.id },
            createdBy: userId
        })
        const savedStatusMap = await this.offersStatusesMap.save(createdStatusMap);
        return savedStatusMap;
    }

    async delete(userId: string, offerId: string) {
        return await this.offersStatusesMap.update({
            offerId: offerId
        }, {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: userId
        })
    }

    async isDeletable(userId: string, offerId: string) {
        const actualStatus = await this.offersStatusesMap.findOne({
            where: {
                offerId: offerId,
            },
            relations: {
                status: true
            },
            order: {
                createdAt: "DESC"
            }
        });
        if (!actualStatus) {
            throw new Error("Статус предложения не найден")
        }
        if (actualStatus.status.isLast) {
            return false;
        }
        return true;
    }

    async getActualStatus(offerId: string) {
        const status = await this.offersStatusesMap.findOne({
            where: {
                offerId: offerId
            },
            relations: { status: true },
            order: { createdAt: "DESC" }
        })
        return status;
    }
}