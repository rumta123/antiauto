import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class SpecificationsDictCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => SpecificationsDict, specificationsDict => specificationsDict.category, { onDelete: 'CASCADE' })
    specifications: SpecificationsDict[];
}

@Entity()
export class SpecificationsDict {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column()
    key_db: string;

    @Column()
    value: string;

    @ManyToOne(() => SpecificationsDictCategory, category => category.specifications)
    @JoinColumn({ name: 'category_id' })
    category: SpecificationsDictCategory;
}