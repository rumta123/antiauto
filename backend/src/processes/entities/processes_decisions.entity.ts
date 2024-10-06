import { BaseAppEntity } from "src/base-app.entity";
import { Column, Entity, Index } from "typeorm";

@Entity('processes_decisions')
export class ProcessesDecisions extends BaseAppEntity {

    @Index()
    @Column({
        type: "enum",
        enum: [
            'accept',
            'reject'
        ],

    }) // если в process_type указан is_boolean_decision=false, то здесь будут храниться варианты решений
    name: string  
}

