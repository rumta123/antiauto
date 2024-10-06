import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessesDecisions1713534735264 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO processes_decisions (name, created_by) VALUES
            ('accept', '${createdBy}'),
            ('reject', '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
