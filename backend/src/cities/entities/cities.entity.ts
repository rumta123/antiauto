import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity, Index } from "typeorm";

@Entity('cities')
export class Cities extends BaseAppEntity {
    @Index()
    @Column()
    name : string

    @Index()
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