import { BaseAppEntity } from "src/base-app.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Offers } from "./offers.entity";
import { OffersStatuses } from "./offers_statuses.entity";
import { OffersStatusesReasons } from "./offers_statuses_reasons.entity";

@Entity('offers_statuses_map')
export class OffersStatusesMap extends BaseAppEntity {

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    offerId: string;

    @ManyToOne(() => Offers, offer => offer.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'offerId' })
    offer: Offers;

    @ManyToOne(() => OffersStatuses, offersStatuses => offersStatuses.id)
    status: OffersStatuses;

    @ManyToOne(() => OffersStatusesReasons, offersStatusesReasons => offersStatusesReasons.id)
    reason: OffersStatusesReasons;
}