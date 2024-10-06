import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";

@Entity('lots_statuses_reasons')
export class LotsStatusesReasons extends BaseAppEntity {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

}

