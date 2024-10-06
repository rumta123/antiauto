import { BaseAppEntity } from 'src/base-app.entity';
import { Accounts } from 'src/account/entities/accounts.entity';
import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity('users')
export class Users extends BaseAppEntity {

    @Column({ unique: true })
    email: string;

    @Column()
    hash: string;

    @Column()
    salt: string;

    @Column({ default: false, name: 'is_email_verified' })
    isEmailVerified: boolean;

    @OneToOne(() => Accounts, account => account.owner)
    account: Accounts;


    @Column({ nullable: true })
    owner_id: string;

    @ManyToOne(() => Users, users => users.account, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner: Users;


}