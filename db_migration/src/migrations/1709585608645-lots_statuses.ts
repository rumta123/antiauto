import { MigrationInterface, QueryRunner } from "typeorm";

export class LotsStatuses1709585608645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO lots_statuses (name, is_last, created_by) VALUES
            ('draft', false, '${createdBy}'),
            ('published', false, '${createdBy}'),
            ('selected_by_buyer', false, '${createdBy}'),
            ('selected_by_seller', false, '${createdBy}'),
            ('contacts_sended', false, '${createdBy}'),
            ('finished', true, '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            DELETE FROM lots_statuses WHERE created_by = '${createdBy}';
        `);
    }

}
