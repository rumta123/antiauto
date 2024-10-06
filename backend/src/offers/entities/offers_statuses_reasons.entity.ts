import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";

@Entity('offers_statuses_reasons')
export class OffersStatusesReasons extends BaseAppEntity {
    @Column()
    name: string

    @Column({ nullable: true })
    description: string;
}
