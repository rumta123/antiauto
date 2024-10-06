import { MigrationInterface, QueryRunner } from "typeorm";
import { randomBytes, pbkdf2Sync } from 'crypto';

export class Testdealers1707682403510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(
            '1234',
            salt,
            1000,
            64,
            'sha512'
        ).toString('hex');

        const dealerTypeId = await queryRunner.query(`
            SELECT id FROM accounts_types WHERE name = 'seller';
        `);

        [
            { email: 'dealer1@example.com' },
            { email: 'dealer2@example.com' },
            { email: 'dealer3@example.com' },
        ].forEach(async dealer => {

            const insertedUser = await queryRunner.query(`
                INSERT INTO users (email, salt, hash, is_email_verified, created_by)
                VALUES ('${dealer.email}', '${salt}', '${hash}', true, '${process.env.DATABASE_USER}')
                RETURNING id;
            `);

            const userId = insertedUser[0].id;

            await queryRunner.query(`
                INSERT INTO accounts (owner_id, name, phone, is_phone_verified, account_type_id, created_by)
                VALUES ('${userId}', 'ТЕСТОВЫЙ ДИЛЕР', '', false, '${dealerTypeId[0].id}', '${process.env.DATABASE_USER}');
            `);
        })


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM accounts
            WHERE owner_id = (SELECT id FROM users WHERE created_by = '${process.env.DATABASE_USER}');
        `);
        await queryRunner.query(`
            DELETE FROM users WHERE created_by = '${process.env.DATABASE_USER}';
        `);
    }

}
