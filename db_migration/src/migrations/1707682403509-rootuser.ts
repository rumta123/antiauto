import { MigrationInterface, QueryRunner } from "typeorm";
import { randomBytes, pbkdf2Sync } from 'crypto';

export class Rootuser1707682403509 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(
            process.env.ROOTUSER_INITPASSWORD!,
            salt,
            1000,
            64,
            'sha512'
        ).toString('hex');

        const insertedUser = await queryRunner.query(`
            INSERT INTO users (email, salt, hash, is_email_verified, created_by)
            VALUES ('${process.env.ROOTUSER_EMAIL}', '${salt}', '${hash}', true, '${process.env.DATABASE_USER}')
            RETURNING id;
        `);

        const userId = insertedUser[0].id;
        const rootTypeId = await queryRunner.query(`
            SELECT id FROM accounts_types WHERE name = 'root';
        `);
        await queryRunner.query(`
            INSERT INTO accounts (owner_id, name, phone, is_phone_verified, account_type_id, created_by)
            VALUES ('${userId}', 'СУПЕР АККАУНТ', '', false, '${rootTypeId[0].id}', '${process.env.DATABASE_USER}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM accounts
            WHERE owner_id = (SELECT id FROM users WHERE email = '${process.env.ROOTUSER_EMAIL}');
        `);
        await queryRunner.query(`
            DELETE FROM users WHERE email = '${process.env.ROOTUSER_EMAIL}';
        `);
    }

}
