import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OptionsDictCategory } from "../entities/options_dict.entity";
import { Repository } from "typeorm";
import { OptionsAttrMapDto } from "../dto";
import { DealersCarOptionsAttrMap } from "src/dealers_cars/entities/dealers_cars_options_attr_map.entity";
import { DealersCarOptionDto } from "src/dealers_cars/dto";

@Injectable()
export class CarCatalogOptionsProvider {
    constructor(
        @InjectRepository(OptionsDictCategory)
        private optionsDictCategoryRepository: Repository<OptionsDictCategory>,
    ) { }
    
    async getOptionsDict() {
        const optionsDictCategories = await this.optionsDictCategoryRepository.find({
            relations: { options: true }
        });
        return optionsDictCategories
    }

    public mapOptionsAttrMapByCategory(optionsDictCategories: OptionsDictCategory[], optionsAttrMap: OptionsAttrMapDto[]|DealersCarOptionDto[]) {
        const detailedOptions = {};
        for (const category of optionsDictCategories) {
            const optionsForCategory = {};
            for (const option of category.options) {
                const oam = optionsAttrMap.find(opt => (opt.option_name === option.key_db))
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
}