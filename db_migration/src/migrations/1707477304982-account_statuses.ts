import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountStatuses1707477304982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO accounts_statuses (name, created_by) VALUES
            ('active', '${createdBy}'),
            ('banned', '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            DELETE FROM accounts_statuses WHERE created_by = '${createdBy}';
        `);
    }

}
