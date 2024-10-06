import { BaseAppEntity } from "src/base-app.entity";
import { Modification } from "src/car-catalog/entities/modification.entity";
import { OptionsCombined } from "src/car-catalog/entities/options_combined.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Lots } from "./lots.entity";

@Entity('lots_options_attrmap')
export class LotsOptionsAttrMap extends BaseAppEntity {

    @ManyToOne(() => Lots, lot => lot.id)
    @JoinColumn({ name: 'lot_id' })
    lot: Lots;

    @ManyToOne(() => Modification, modification => modification.complectationId)
    @JoinColumn({ name: 'complectation_id' })
    complectation: Modification;

    @Column()
    combined_option_id: string;
    
    @ManyToOne(() => OptionsCombined, complOption => complOption.id)
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
    strict: boolean;

}