import { BaseAppEntity } from "src/base-app.entity";
import { Configuration } from "src/car-catalog/entities/configuration.entity";
import { Generation } from "src/car-catalog/entities/generation.entity";
import { Mark } from "src/car-catalog/entities/mark.entity";
import { Model } from "src/car-catalog/entities/model.entity";
import { Modification } from "src/car-catalog/entities/modification.entity";
import { Cities } from "src/cities/entities/cities.entity";
import { Users } from "src/users/entities/users.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { DealersCarOptionsAttrMap } from "./dealers_cars_options_attr_map.entity";
import { DealersCarsStatusesMap } from "./dealers_cars_statuses_map.entity";
import { DealersCarsPhotos } from "./dealers_cars_photos.entity";

@Entity('dealers_cars')
@Index("idx_dealer", ["id", "dealer", "deleted", "isVerified"])
@Index("idx_vin", ["vin"])
export class DealersCars extends BaseAppEntity {

    @Column()
    user_id: string;

    @ManyToOne(() => Users, user => user.id)
    @JoinColumn({ name: 'user_id' })
    dealer: Users;

    @Column({ name: 'is_verified', nullable: false })
    isVerified: boolean;

    @Column({ name: 'is_filled', nullable: false })
    isFilled: boolean;

    @Column({ nullable: false, default: 0 })
    sequence: number;

    @Column({ nullable: true })
    year: number;

    @Column({ nullable: true })
    mileage: number;

    @Column({ name: 'is_mileage_abroad', nullable: false, default: false })
    isMileageAbroad: boolean;

    @Column({ nullable: true })
    vin: string;

    @Column({ nullable: true })
    brand_id: string;  

    @ManyToOne(() => Mark, mark => mark.id)
    @JoinColumn({ name: 'brand_id' })
    brand: Mark;

    @Column({ nullable: true })
    model_id: string; 

    @ManyToOne(() => Model, model => model.id)
    @JoinColumn({ name: 'model_id' })
    model: Model;

    @Column({ nullable: true })
    generation_id: string; 

    @ManyToOne(() => Generation, generation => generation.id)
    @JoinColumn({ name: 'generation_id' })
    generation: Generation;

    @Column({ nullable: true })
    configuration_id: string; 

    @ManyToOne(() => Configuration, configuration => configuration.id)
    @JoinColumn({ name: 'configuration_id' })
    configuration: Configuration

    @Column({ nullable: true })
    complectation_id: string; 

    @ManyToOne(() => Modification, modification => modification.complectationId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'complectation_id' })
    complectation: Modification;

    @Column({ nullable: true })
    engine_hash: string;

    @OneToMany(() => DealersCarOptionsAttrMap, optionsAttrMap => optionsAttrMap.dealers_car, { onDelete: 'CASCADE' })
    options: DealersCarOptionsAttrMap[]

    @Column({ nullable: true })
    city_id: string; 

    @ManyToOne(() => Cities, city => city.id)
    @JoinColumn({ name: 'city_id' })
    city: Cities;

    @OneToMany(() => DealersCarsStatusesMap, map => map.status, { onDelete: 'CASCADE' })
    statuses: DealersCarsStatusesMap[]

    @OneToMany(() => DealersCarsPhotos, photo => photo.dealers_car, { onDelete: 'CASCADE' })
    photos: DealersCarsPhotos[]
}