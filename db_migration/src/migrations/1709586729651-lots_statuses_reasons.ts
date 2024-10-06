import { MigrationInterface, QueryRunner } from "typeorm";

export class LotsStatusesReasons1709586729651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO lots_statuses_reasons (name, description, created_by) VALUES
            ('deadline_exceeded', 'срок размещения превышен', '${createdBy}'),
            ('canceled', 'отменён пользователем',  '${createdBy}'),
            ('deal', 'сделка состоялась', '${createdBy}'),
            ('deleted_by_support', 'удалён поддержкой', '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            DELETE FROM lots_statuses_reasons WHERE created_by = '${createdBy}';
        `);
    }

}
