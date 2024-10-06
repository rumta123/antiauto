import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Modification } from "../entities/modification.entity";
import { Repository } from "typeorm";

@Injectable()
export class CarCatalogHelperProvider {
    constructor(
        @InjectRepository(Modification)
        private modificationRepository: Repository<Modification>,
    ) { }
    
    async getBrandModelGenConfInfoByEngineHash(engine_hash: string) {
        const modification = await this.modificationRepository.findOne({
            where: { engine_hash: engine_hash },
            relations: {
                configuration: {
                    generation: {
                        model: {
                            mark: true
                        }
                    }
                }
            }
        })
        if (!modification) {
            throw new Error("Конфигурация не найдена")
        }

        return {
            configuration: modification.configuration,
            generation: modification.configuration.generation,
            model: modification.configuration.generation.model,
            brand: modification.configuration.generation.model.mark
        }
    }
}