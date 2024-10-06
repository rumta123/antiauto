import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";

@Entity('lots_statuses')
export class LotsStatuses extends BaseAppEntity {
    @Column({ unique: true })
    name: string;

    @Column({name:'is_last'})
    isLast: boolean;

}

