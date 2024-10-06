import { MigrationInterface, QueryRunner } from "typeorm";

export class DealersCarsStatuses1709809527100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO dealers_cars_statuses (name, is_last, created_by) VALUES
            ('published', false, '${createdBy}'),
            ('sold', true, '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            DELETE FROM dealers_cars_statuses WHERE created_by = '${createdBy}';
        `);
    }

}
