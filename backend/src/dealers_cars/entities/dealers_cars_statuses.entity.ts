import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";

@Entity('dealers_cars_statuses')
export class DealersCarsStatuses extends BaseAppEntity {
    @Column({ unique: true })
    name: string;

    @Column({name:'is_last'})
    isLast: boolean;

}

