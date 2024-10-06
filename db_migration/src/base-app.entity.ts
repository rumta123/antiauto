import { Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';


export abstract class BaseAppEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_by' })
    createdBy: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ nullable: true, name: 'updated_by' })
    updatedBy: string;

    @Column({ default: false })
    deleted: boolean;

    @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
    deletedAt: Date;

    @Column({ nullable: true, name: 'deleted_by' })
    deletedBy: string;

}
