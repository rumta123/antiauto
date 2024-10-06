import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DealersCars } from "./dealers_cars.entity";

@Entity('dealers_cars_photos')
export class DealersCarsPhotos extends BaseAppEntity {

    @Column()
    dealer_car_id: string;

    @ManyToOne(() => DealersCars, dealersCars => dealersCars.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dealer_car_id' })
    dealers_car: DealersCars;

    @Column({ type: "bytea", nullable: true })
    image: Buffer | null;

    @Column({name:'is_primary'})
    isPrimary: boolean;

}

