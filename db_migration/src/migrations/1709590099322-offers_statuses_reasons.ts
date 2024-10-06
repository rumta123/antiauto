import { MigrationInterface, QueryRunner } from "typeorm";

export class OffersStatusesReasons1709590099322 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO offers_statuses_reasons (name, description, created_by) VALUES
            ('canceled_by_seller', 'отменён продавцом', '${createdBy}'),
            ('lot_canceled', 'отмена лота',  '${createdBy}'),
            ('deal', 'сделка состоялась', '${createdBy}'),
            ('another_deal', 'другая сделка состоялась', '${createdBy}'),
            ('lot_expired', 'закончилось время размещения лота', '${createdBy}'),
            ('offer_expired', 'закончилось время размещения срочного предложения', '${createdBy}'),
            ('deleted_by_support', 'удалён поддержкой', '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            DELETE FROM offers_statuses_reasons WHERE created_by = '${createdBy}';
        `);
    }

}
