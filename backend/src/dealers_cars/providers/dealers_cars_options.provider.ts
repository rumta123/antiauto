import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { DealersCarOptionsAttrMap } from "../entities/dealers_cars_options_attr_map.entity";
import { DealersCarOptionDto } from "../dto";

@Injectable()
export class DealersCarsOptionsProvider {
    constructor(
        @InjectRepository(DealersCarOptionsAttrMap)
        private dealersCarsOptionsRepository: Repository<DealersCarOptionsAttrMap>,
    ) { }

    async getByCarId(carId: string) {
        const options = this.dealersCarsOptionsRepository.find({
            where: {
                dealers_car: { id: carId },
                deleted: false
            }
        })
        return options;
    }
    public mapOptionsAttrMapByCategory(optionsDictCategories: any[], optionsAttrMap: DealersCarOptionDto[]) {
        const detailedOptions = {};
        for (const category of optionsDictCategories) {
            const optionsForCategory = {};
            for (const option of category.options) {
                const oam = optionsAttrMap.find(opt => (opt.option_name === option.value))
                if (oam) {
                    optionsForCategory[option.value] = oam
                }
            }
            if (Object.keys(optionsForCategory).length > 0) {
                detailedOptions[category.name] = optionsForCategory;
            }
        }
        return detailedOptions;
    }

    async delete(userId: string, carId: string) {
        return await this.dealersCarsOptionsRepository.update({
            dealers_car: { id: carId }
        }, {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: userId
        })
    }
}