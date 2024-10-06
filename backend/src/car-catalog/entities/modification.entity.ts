import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Configuration } from './configuration.entity';
import { Options } from './options.entity';
import { Specifications } from './specifications.entity';
import { ComplectationsOptionsAttrMap } from './complectations_options_attrmap.entity';

@Entity('modification')
export class Modification {
    @PrimaryColumn({ name: 'complectation-id' })
    complectationId: string;

    @Column({ nullable: false, name: 'engine_hash' })
    engine_hash: string;

    @Column({ nullable: true, name: 'offers-price-from' })
    offersPriceFrom: number;

    @Column({ nullable: true, name: 'offers-price-to' })
    offersPriceTo: number;

    @Column({ nullable: true, name: 'group-name' })
    groupName: string;

    @Column({ name: 'configuration_id' })
    configurationId: string;

    @ManyToOne(() => Configuration, configuration => configuration.modifications)
    @JoinColumn({ name: "configuration_id", referencedColumnName: "id" })
    configuration: Configuration;

    @OneToOne(() => Options, options => options.modification, { cascade: true })
    options: Options;

    @OneToMany(() => ComplectationsOptionsAttrMap, options => options.complectation, { cascade: true })
    options_attrmap: ComplectationsOptionsAttrMap[];

    @OneToOne(() => Specifications, specifications => specifications.modification, { cascade: true })
    specifications: Specifications;
}
