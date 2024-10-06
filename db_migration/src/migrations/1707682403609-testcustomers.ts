import { MigrationInterface, QueryRunner } from "typeorm";
import { randomBytes, pbkdf2Sync } from 'crypto';

export class Testcustomers1707682403610 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(
            '1234',
            salt,
            1000,
            64,
            'sha512'
        ).toString('hex');

        const customerTypeId = await queryRunner.query(`
            SELECT id FROM accounts_types WHERE name = 'customer';
        `);

        [
            { email: 'customer1@example.com', phone:'+79268843251' },
            { email: 'customer2@example.com', phone:'+79268843252' },
            { email: 'customer3@example.com', phone:'+79268843253' },
        ].forEach(async customer => {

            const insertedUser = await queryRunner.query(`
                INSERT INTO users (email, salt, hash, is_email_verified, created_by)
                VALUES ('${customer.email}', '${salt}', '${hash}', true, '${process.env.DATABASE_USER}')
                RETURNING id;
            `);

            const userId = insertedUser[0].id;

            await queryRunner.query(`
            INSERT INTO accounts (owner_id, name, phone, is_phone_verified, account_type_id, created_by)
            VALUES ('${userId}', 'ТЕСТОВЫЙ ДИЛЕР', '${customer.phone}', true, '${customerTypeId[0].id}', '${process.env.DATABASE_USER}');
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
