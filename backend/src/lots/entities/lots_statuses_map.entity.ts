import { BaseAppEntity } from "src/base-app.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Lots } from "./lots.entity";
import { LotsStatuses } from "./lots_statuses.entity";
import { LotsStatusesReasons } from "./lots_statuses_reasons.entity";

@Entity('lots_statuses_map')
export class LotsStatusesMap extends BaseAppEntity {

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    lot_id: string;

    @ManyToOne(() => Lots, lot => lot.id)
    @JoinColumn({ name: 'lot_id'})
    lot: Lots;

    @ManyToOne(() => LotsStatuses, lotsStatuses => lotsStatuses.id)
    status: LotsStatuses;

    @ManyToOne(() => LotsStatusesReasons, lotsStatusesReasons => lotsStatusesReasons.id)
    statusReason: LotsStatusesReasons;
}