import { Injectable } from "@nestjs/common";
import { OfferOptionsAttrMap } from "../entities/offers_options_attr_map.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Offers } from "../entities/offers.entity";
import { OfferOptionDto } from "../dto";

@Injectable()
export class OffersOptionsProvider {
    constructor(
        @InjectRepository(OfferOptionsAttrMap)
        private offersOptionsRepository: Repository<OfferOptionsAttrMap>,
    ) {

    }

    async create(userId: string, offer: Offers, option: OfferOptionDto) {
        const newOption = this.offersOptionsRepository.create({
            offer: offer,
            option: {
                id: option.combined_option_id
            },
            option_name: option.option_name,
            value: option.value,
            accordance_type: option.accordance_type,
            createdBy: userId
        });
        return await this.offersOptionsRepository.save(newOption);
    }

    async getOptionsByOfferIdSortByAccordance(offerId: string) {
        return (await this.offersOptionsRepository.find({ where: { offer_id: offerId } })).sort((a, b) => {
            const order = { 'unsatisfied': 1, 'satisfied': 2, 'additional': 3 };
            return order[a.accordance_type] - order[b.accordance_type];
        })
    }

    async delete(userId: string, offerId: string) {
        return await this.offersOptionsRepository.update({
            offer_id: offerId
        }, {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: userId
        })
    }
}