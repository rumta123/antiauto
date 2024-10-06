import { BaseAppEntity } from "src/base-app.entity";
import { Modification } from "src/car-catalog/entities/modification.entity";
import { OptionsCombined } from "src/car-catalog/entities/options_combined.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { DealersCars } from "./dealers_cars.entity";

@Entity('dealers_cars_options_attr_map')
@Index("idx_car_combined_option", ["dealers_car","combined_option_id"])
export class DealersCarOptionsAttrMap extends BaseAppEntity {

    @ManyToOne(() => DealersCars, dealersCars => dealersCars.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dealer_car_id' })
    dealers_car: DealersCars;

    @ManyToOne(() => Modification, modification => modification.complectationId)
    @JoinColumn({ name: "complectation_id", referencedColumnName: "complectationId" })
    complectation: Modification;


    @Column()
    combined_option_id: string;

    @ManyToOne(() => OptionsCombined, optionsCombined => optionsCombined.id)
    @JoinColumn({ name: 'combined_option_id' })
    option: OptionsCombined;

    @Column()
    option_name: string;

    @Column()
    value: string;

    @Column({
        type: "enum",
        enum: ["string", "boolean" ],
        default: "string"
    })
    value_type: string;

    @Column({default: false})
    is_complectation_option: boolean;

}