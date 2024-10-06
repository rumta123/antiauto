import { MigrationInterface, QueryRunner } from "typeorm";
import * as path from 'path';
import * as fs from 'fs';
import { OptionsDict,OptionsDictCategory} from '../car-catalog-update/entities/options_dict.entity'
import { Options } from "../car-catalog-update/entities/options.entity";

interface OptionsInterface {
    [category: string]: {
        [key: string]: string;
    };
}

export class OptionsDictionaryMigration1704975834247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const optionsCategoryRepository = queryRunner.manager.getRepository(OptionsDictCategory);
        const optionsDictRepository = queryRunner.manager.getRepository(OptionsDict);
        const optionsRepository = queryRunner.manager.getRepository(Options);
        const optionsRepositoryMeta = optionsRepository.metadata;

        const optionsData: OptionsInterface = JSON.parse(fs.readFileSync(path.join( '/app/carbase/helpers/options.json'), 'utf8'));

        for (const [categoryName, options] of Object.entries(optionsData)) {
            const category = optionsCategoryRepository.create({ name: categoryName });
            await optionsCategoryRepository.save(category);

            for (const [prop, value] of Object.entries(options as Record<string, string>)) {
                let column = optionsRepositoryMeta.columns.find(column => column.databaseName === prop);
                if (column) {
                    const key = column.propertyName;

                    const option = optionsDictRepository.create({ key, key_db: prop, value, category });
                    await optionsDictRepository.save(option);
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
