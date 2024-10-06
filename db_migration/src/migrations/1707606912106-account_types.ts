import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountTypes1707606912106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            INSERT INTO accounts_types (name, created_by) VALUES
            ('customer', '${createdBy}'),
            ('seller', '${createdBy}'),
            ('root', '${createdBy}'),
            ('service_desk', '${createdBy}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const createdBy = process.env.DATABASE_USER || 'postgres';
        await queryRunner.query(`
            DELETE FROM accounts_types WHERE created_by = '${createdBy}';
        `);
    }

}
