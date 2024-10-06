import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";

@Entity('accounts_statuses')
export class AccountsStatuses extends BaseAppEntity {
    @Column({ unique: true })
    name: string;
}