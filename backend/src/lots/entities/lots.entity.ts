import { BaseAppEntity } from 'src/base-app.entity';
import { Cities } from 'src/cities/entities/cities.entity';
import { Check, Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { LotsStatusesMap } from './lots_statuses_map.entity';
import { LotsOptionsAttrMap } from './lots_options_attrmap.entity';
import { Mark } from 'src/car-catalog/entities/mark.entity';
import { Model } from 'src/car-catalog/entities/model.entity';
import { Generation } from 'src/car-catalog/entities/generation.entity';
import { Configuration } from 'src/car-catalog/entities/configuration.entity';
import { Modification } from 'src/car-catalog/entities/modification.entity';
import { Users } from 'src/users/entities/users.entity';
import { Min } from 'class-validator';
import { Offers } from 'src/offers/entities/offers.entity';

@Entity('lots')
// @Check(`"lot_id" > 12844`)

export class Lots extends BaseAppEntity {

    @Column()
    @Generated('increment')
    // @Min(12844) <-- not working
    lot_id: number; //min:12844

    @OneToMany(() => LotsStatusesMap, lotsStatusesMap => lotsStatusesMap.status, { onDelete: 'CASCADE' })
    statuses: LotsStatusesMap[]

    @OneToMany(() => LotsOptionsAttrMap, lotsOptionsAttrMap => lotsOptionsAttrMap.lot, { onDelete: 'CASCADE' })
    options: LotsOptionsAttrMap[]

    @Column({nullable:true})
    city_id: string;

    @ManyToOne(() => Cities, city => city.id)
    @JoinColumn({ name: 'city_id' })
    city: Cities;

    @Column()
    max_distance: number;

    @ManyToOne(() => Mark, mark => mark.id)
    @JoinColumn({ name: 'mark_id' })
    mark: Mark;

    @ManyToOne(() => Model, model => model.id)
    @JoinColumn({ name: 'model_id' })
    model: Model;

    @ManyToOne(() => Generation, generation => generation.id)
    @JoinColumn({ name: 'generation_id' })
    generation: Generation;

    @ManyToOne(() => Configuration, configuration => configuration.id)
    @JoinColumn({ name: 'configuration_id' })
    configuration: Configuration

    @Column()
    engine_hash: string;

    @Column()
    user_id: string;    
        
    @ManyToOne(() => Users, user => user.id)
    @JoinColumn({ name: 'user_id' })
    owner: Users;

    @OneToMany(() => Offers, offer => offer.lot)
    offers: Offers[];
}





