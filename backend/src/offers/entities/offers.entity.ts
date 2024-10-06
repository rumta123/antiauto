import { BaseAppEntity } from "src/base-app.entity";
import { DealersCars } from "src/dealers_cars/entities/dealers_cars.entity";
import { Lots } from "src/lots/entities/lots.entity";
import { LotsStatusesMap } from "src/lots/entities/lots_statuses_map.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OffersStatusesMap } from "./offers_statuses_map.entity";
import { OfferOptionsAttrMap } from "./offers_options_attr_map.entity";
import { Cities } from "src/cities/entities/cities.entity";


@Entity('offers')
@Index('idx_lot_car', ['lot_id', 'dealers_car_id'])
export class Offers extends BaseAppEntity {

    @Column({ nullable: false })
    lot_id: string;

    @ManyToOne(() => Lots, lot => lot.id)
    @JoinColumn({
        name: "lot_id", referencedColumnName: "id"
    })
    lot: Lots;

    @Column({ nullable: false, default: 0 })
    sequence: number;

    @Column({ nullable: false })
    dealers_car_id: string;

    @ManyToOne(() => DealersCars, dealersCar => dealersCar.id)
    @JoinColumn({
        name: "dealers_car_id"
    })
    dealers_car: DealersCars;

    @Column({ nullable: false })
    price: number;

    @Column({ type: 'timestamp', nullable: true })
    price_valid_till: Date | null;

    @Column({ nullable: true })
    distance: number;

    @Column({ nullable: true })
    city_id: string;

    @OneToMany(() => Cities, city => city.id)
    @JoinColumn({ name: 'city_id' })
    city: string;

    @Column({ nullable: false, default: 0 })
    waiting: number;

    @Column({ default: false })
    isCreditAvailable: boolean;

    @Column({ default: false })
    isInsuranceAvailable: boolean;

    @Column({ default: false })
    isTradeinAvailable: boolean;

    @OneToMany(() => OffersStatusesMap, offersStatusesMap => offersStatusesMap.offer, { onDelete: 'CASCADE' })
    statuses: OffersStatusesMap[];

    @OneToMany(() => OfferOptionsAttrMap, optionsMap => optionsMap.id, { onDelete: 'CASCADE' })
    options: OfferOptionsAttrMap[];

}