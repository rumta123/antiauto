import { MigrationInterface, QueryRunner, Repository } from "typeorm";
import * as path from 'path';
import * as fs from 'fs';
import { SpecificationsDict, SpecificationsDictCategory } from '../car-catalog-update/entities/specifications_dict.entity'
import { Specifications } from "../car-catalog-update/entities/specifications.entity";


interface SpecificationsInterface {
    [category: string]: {
        [key: string]: string;
    };
}

export class SpecificationsDictionaryMigration1704977410673 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const specificationsCategoryRepository = queryRunner.manager.getRepository(SpecificationsDictCategory);
        const specificationsDictRepository = queryRunner.manager.getRepository(SpecificationsDict);
        const specificationsRepository = queryRunner.manager.getRepository(Specifications);

        const specificationsRepositoryMeta = specificationsRepository.metadata;

        const specificationsData: SpecificationsInterface = JSON.parse(fs.readFileSync(path.join('/app/carbase/helpers/specifications.json'), 'utf8'));

        for (const [categoryName, options] of Object.entries(specificationsData)) {
            const category = specificationsCategoryRepository.create({ name: categoryName });
            await specificationsCategoryRepository.save(category);

            for (const [prop, value] of Object.entries(options as Record<string, string>)) {
                let column = specificationsRepositoryMeta.columns.find(column => column.databaseName === prop);
                if (column) {
                    const key = column.propertyName;
                    const option = specificationsDictRepository.create({ key, key_db: prop, value, category });
                    await specificationsDictRepository.save(option);
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
