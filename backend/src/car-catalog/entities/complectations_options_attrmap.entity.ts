import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Modification } from "./modification.entity";
import { OptionsCombined } from "./options_combined.entity";



@Entity('complectations_options_attrmap')
@Index("idx_complectation_option", ["complectation_id", "option_id"])
@Index("idx_complectation", ["complectation_id"])
@Index("idx_enginehash", ["engine_hash"])
export class ComplectationsOptionsAttrMap extends BaseAppEntity {
    @PrimaryColumn({ name: "complectation_id" })
    complectation_id: string;

    @Column({ nullable: false, name: 'engine_hash' })
    engine_hash: string;

    @ManyToOne(() => Modification, modification => modification.complectationId)
    @JoinColumn({ name: "complectation_id", referencedColumnName: "complectationId" })
    complectation: Modification;

    @PrimaryColumn({ name: "option_id" })
    option_id: string;

    @ManyToOne(() => OptionsCombined, optionsCombined => optionsCombined.id)
    @JoinColumn({ name: "option_id" })
    option: OptionsCombined;

    @Column()
    value: string;

    @Column({
        type: "enum",
        enum: ["string", "boolean"],
        default: "boolean"
    })
    value_type: string;

}