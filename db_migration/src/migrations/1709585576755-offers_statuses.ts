import { MigrationInterface, QueryRunner } from "typeorm";

export class OffersStatuses1709585576755 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO offers_statuses (name, name_cyrillic, is_last, is_visible_for_buyer, created_by) VALUES
            ('draft', 'черновик', false, false, '${createdBy}'),
            ('moderation', 'на модерации', false, false, '${createdBy}'),
            ('published', 'опубликован', false, true, '${createdBy}'),
            ('selected_by_buyer', 'выбран покупателем', false, true, '${createdBy}'),
            ('selected_by_seller', 'выбран продавцом', false, true, '${createdBy}'),
            ('contacts_sended', 'контакт отправлен', true, true, '${createdBy}'),
            ('finished', 'завершён', true, true, '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            DELETE FROM offers_statuses WHERE created_by = '${createdBy}';
        `);
    }

}
