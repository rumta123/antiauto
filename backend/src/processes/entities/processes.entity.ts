import { BaseAppEntity } from "src/base-app.entity";
import { Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { ProcessesTypes } from "./processes_types.entity";
import { Users } from "src/users/entities/users.entity";
import { Lots } from "src/lots/entities/lots.entity";
import { Offers } from "src/offers/entities/offers.entity";
import { DealersCars } from "src/dealers_cars/entities/dealers_cars.entity";
import { ProcessesDecisions } from "./processes_decisions.entity";
import { ProcessesMessages } from "./processes_messages.entity";

@Entity('processes')
export class Processes extends BaseAppEntity {

    @Column()
    process_type_id: string;

    @ManyToOne(() => ProcessesTypes, processType => processType.id)
    @JoinColumn({ name: 'process_type_id', referencedColumnName: 'id' })
    process_type: ProcessesTypes;

    @Column({ nullable: true })
    customer_id: string;

    @ManyToOne(() => Users, user => user.id)
    @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
    customer: Users;

    @Column({ nullable: true })
    lot_id: string;

    @ManyToOne(() => Lots, lot => lot.id)
    @JoinColumn({ name: 'lot_id' })
    lot: Lots;

    @Column({ nullable: true })
    offer_id: string;

    @ManyToOne(() => Offers, offer => offer.id)
    @JoinColumn({ name: 'offer_id' })
    offer: Offers;

    @Column({ nullable: true })
    dealers_car_id: string;

    @ManyToOne(() => DealersCars, car => car.id)
    @JoinColumn({ name: 'dealers_car_id' })
    dealers_car: DealersCars;

    @Column()
    is_decision_required: boolean;

    @Column({ nullable: true })
    decision_id: string;

    @ManyToOne(() => ProcessesDecisions, decision => decision.id)
    @JoinColumn({ name: 'decision_id', referencedColumnName: 'id' })
    decision: ProcessesDecisions;

    @Column()
    is_process_closed: boolean;

    @OneToMany(() => ProcessesMessages, message => message.process)
    messages: ProcessesMessages[];
}

