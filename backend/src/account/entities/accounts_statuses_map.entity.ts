import { BaseAppEntity } from "src/base-app.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Accounts } from "./accounts.entity";
import { AccountsStatuses } from "./accounts_statuses.entity";

@Entity('accounts_statuses_map')
export class AccountsStatusesMap extends BaseAppEntity {
    @ManyToOne(() => Accounts, accounts => accounts.id)
    @JoinColumn({ name: 'account_id' })
    account: Accounts;

    @ManyToOne(() => AccountsStatuses, accountsStatuses => accountsStatuses.id)
    @JoinColumn({ name: 'status_id' })
    status: AccountsStatuses;
}