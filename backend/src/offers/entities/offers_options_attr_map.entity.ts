import { BaseAppEntity } from "src/base-app.entity";
import { Modification } from "src/car-catalog/entities/modification.entity";
import { OptionsCombined } from "src/car-catalog/entities/options_combined.entity";
import { DealersCars } from "src/dealers_cars/entities/dealers_cars.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Offers } from "./offers.entity";


@Entity('offer_options_attr_map')
@Index("idx_offer_combined_option", ["offer_id", "combined_option_id"])
export class OfferOptionsAttrMap extends BaseAppEntity {

    @Column()
    offer_id: string;

    @ManyToOne(() => Offers, offer => offer.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'offer_id' })
    offer: Offers;

    @ManyToOne(() => DealersCars, dealersCars => dealersCars.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dealer_car_id' })
    dealers_car: DealersCars;

    @Column()
    combined_option_id: string;

    @Column({
        type: "enum",
        enum: ["strict", "satisfied", "unsatisfied", "additional"],
        default: "strict"
    })
    accordance_type: string;

    @ManyToOne(() => OptionsCombined, optionsCombined => optionsCombined.id)
    @JoinColumn({ name: 'combined_option_id' })
    option: OptionsCombined;

    @Column()
    option_name: string;

    @Column()
    value: string;

    @Column({
        type: "enum",
        enum: ["string", "boolean"],
        default: "string"
    })
    value_type: string;

    @Column({ default: false })
    is_complectation_option: boolean;

}