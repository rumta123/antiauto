import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";

@Entity('accounts_types')
export class AccountsTypes extends BaseAppEntity {
    @Column({
        type: "enum",
        enum: ["customer", "seller", "root", "service_desk"],
        default: "customer"
    })
    name: string;
}