import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity, Index } from "typeorm";


@Entity('options_combined')
export class OptionsCombined extends BaseAppEntity {
    @Index()
    @Column()
    name: string;
}
