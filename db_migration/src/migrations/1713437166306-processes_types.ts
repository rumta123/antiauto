import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessesTypes1713437166306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO processes_types (name, is_boolean_decision, created_by) VALUES
            ('chat', false, '${createdBy}'),
            ('offer_moderation', true, '${createdBy}'),
            ('feedback_moderation', true, '${createdBy}'),
            ('dealer_registration', true, '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
