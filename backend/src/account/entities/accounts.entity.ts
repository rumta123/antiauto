import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { BaseAppEntity } from 'src/base-app.entity';
import { AccountsTypes } from './accounts_types.entity';

@Entity('accounts')
export class Accounts extends BaseAppEntity {

    @OneToOne(() => Users, users => users.account, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner: Users;

    @Column()
    phone: string;

    @Column({ default: false, name: 'is_phone_verified' })
    isPhoneVerified: boolean;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    lastname: string;
    //TODO: добавить (связи)виртуальное поле(свойство) возвращающий status  на текущую дату

    @Column({ nullable: false })
    account_type_id: string; 

    @ManyToOne(() => AccountsTypes, accountsTypes => accountsTypes.id)
    @JoinColumn({ name: 'account_type_id', referencedColumnName:'id'})
    account_type: AccountsTypes;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    comment: string;
}

