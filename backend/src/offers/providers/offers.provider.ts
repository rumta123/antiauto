import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offers } from '../entities/offers.entity';
import { Repository } from 'typeorm';
import { OfferCreateDto, OfferDto } from '../dto';

@Injectable()
export class OffersProvider {

    constructor(
        @InjectRepository(Offers)
        private offersRepository: Repository<Offers>,
    ) { }

    async create(userId: string, body: any) {
        const maxSequence = await this.offersRepository.maximum("sequence", { lot_id: body.lot_id }) || 0

        const newOffer = this.offersRepository.create({
            lot_id: body.lot_id,
            dealers_car_id: body.dealers_car_id,
            price: body.price,
            price_valid_till: body.priceValidTill,
            waiting: body.waiting,
            isCreditAvailable: body.isCreditAvailable,
            isInsuranceAvailable: body.isInsuranceAvailable,
            isTradeinAvailable: body.isTradeinAvailable,
            distance: body.distance,
            // city_id: body.city_id,
            sequence: maxSequence + 1,
            createdBy: userId
        })
        const savedOffer = await this.offersRepository.save(newOffer);
        return savedOffer
    }

    async getOffersForCustomer(userId, filter) {
        const lotId = filter.lotId
        const actualStatusSubQuery = this.offersRepository
            .createQueryBuilder('offer')
            .select('statusMap.offerId', 'offerId')
            .addSelect('MAX(statusMap.timestamp)', 'maxTimestamp')
            .innerJoin('offer.statuses', 'statusMap')
            .where('offer.lot_id = :lotId', { lotId })
            .groupBy('statusMap.offerId');

        const offersQuery = this.offersRepository
            .createQueryBuilder('offer')
            .leftJoinAndSelect('offer.statuses', 'statusMap')
            .leftJoinAndSelect('statusMap.status', 'status')
            .leftJoinAndSelect('offer.lot', 'lot')
            .where('offer.lot_id = :lotId', { lotId })
            .andWhere('lot.user_id = :userId', { userId })
            .andWhere('(statusMap.offerId, statusMap.timestamp) IN (' + actualStatusSubQuery.getQuery() + ')')
            .andWhere('status.isVisibleForBuyer = true')
            .setParameters(actualStatusSubQuery.getParameters());
        const offersWithLatestStatus = await offersQuery.getMany();

        return offersWithLatestStatus;
    }

    private actualStatusSubQuery(lotId?: string) {
        return this.offersRepository
            .createQueryBuilder('offer')
            .select('statusMap.offerId', 'offerId')
            .addSelect('MAX(statusMap.timestamp)', 'maxTimestamp')
            .innerJoin('offer.statuses', 'statusMap')
            .where('offer.lot_id = :lotId', { lotId })
            .groupBy('statusMap.offerId');
    }

    async getOwnOffersForSeller(userId, filter: { lotId?: string }) {
        const lotId = filter.lotId;
        const ownOffersQuery = this.offersRepository
            .createQueryBuilder('offer')
            .leftJoinAndSelect('offer.statuses', 'statusMap')
            .leftJoinAndSelect('statusMap.status', 'status')
            .leftJoinAndSelect('offer.dealers_car', 'dealers_car')
            .where('offer.lot_id = :lotId', { lotId })
            .andWhere('dealers_car.user_id = :userId', { userId })
            .andWhere('(statusMap.offerId, statusMap.timestamp) IN (' + this.actualStatusSubQuery(lotId).getQuery() + ')')
            .setParameters(this.actualStatusSubQuery(lotId).getParameters());
        const ownOffersWithLatestStatus = await ownOffersQuery.getMany();
        return ownOffersWithLatestStatus
    }

    async getOffersForSeller(userId, filter: { lotId?: string }) {
        const lotId = filter.lotId
        const ownOffersWithLatestStatus = await this.getOwnOffersForSeller(userId, { lotId })
        const otherOffersQuery = this.offersRepository
            .createQueryBuilder('offer')
            .leftJoinAndSelect('offer.statuses', 'statusMap')
            .leftJoinAndSelect('statusMap.status', 'status')
            .leftJoinAndSelect('offer.dealers_car', 'dealers_car')
            .where('offer.lot_id = :lotId', { lotId })
            .andWhere('dealers_car.user_id <> :userId', { userId })
            .andWhere('(statusMap.offerId, statusMap.timestamp) IN (' + this.actualStatusSubQuery(lotId).getQuery() + ')')
            .andWhere('status.isVisibleForBuyer = true')
            .setParameters(this.actualStatusSubQuery(lotId).getParameters());
        const otherOffersWithLatestStatus = await otherOffersQuery.getMany();
        return [...ownOffersWithLatestStatus, ...otherOffersWithLatestStatus]

    }

    async getAllFilteredOffers({ filter }) {
        const offers = this.offersRepository.find({
            where: { lot_id: filter.lotId },
            relations: {
                dealers_car: { city: true },
                statuses: {
                    status: true,
                    reason: true
                }
            }
        })
        return offers
    }

    async getOffersByCarId(userId: string, carId: string) {
        const offers = await this.offersRepository.find({
            where: {
                dealers_car_id: carId
            }
        })
        return offers;
    }

    async getOwnOfferById(userId: string, offerId: string) {
        const offer = await this.offersRepository.findOne({
            where: {
                id: offerId,
                dealers_car: {
                    user_id: userId
                }
            },
            relations: {
                dealers_car: true
            }
        })
        return offer;
    }

    async getOfferById(userId: string, offerId: string) {
        const offer = await this.offersRepository.findOne({
            where: {
                id: offerId,
            },
            relations: {
                dealers_car: {
                    dealer: true
                }
            }
        })
        return offer;
    }

    async delete(userId: string, offerId: string) {
        return await this.offersRepository.update({ id: offerId }, {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: userId
        });
    }
}
