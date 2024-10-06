import { BaseAppEntity } from 'src/base-app.entity';
import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Processes } from './processes.entity';
import { Users } from 'src/users/entities/users.entity';

@Entity('processes_messages')
export class ProcessesMessages extends BaseAppEntity {

    @Column()
    process_id: string;

    @ManyToOne(() => Processes, process => process.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_id' })
    process: Processes;

    @Column()
    message: string;

    @Column({ nullable: false })
    author_id: string;

    @ManyToOne(() => Users, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: Users;
}