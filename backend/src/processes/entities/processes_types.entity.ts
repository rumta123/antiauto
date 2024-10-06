import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity } from "typeorm";


@Entity('processes_types')
export class ProcessesTypes extends BaseAppEntity {
    @Column({
        type: 'enum',
        enum: ['dealer_registration', 'offer_moderation', 'feedback_moderation', 'chat'],
        default: 'chat'
    })
    name: string;

    @Column()
    is_boolean_decision: boolean;
}

