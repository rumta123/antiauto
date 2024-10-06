import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";

@Entity('cities')
export class Cities extends BaseAppEntity {
    @Column()
    name : string

    @Column()
    subject: string

    @Column()
    district: string

    @Column()
    population: number

    @Column()
    coords_lat: string

    @Column()
    coords_lon: string

}