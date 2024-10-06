import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class OptionsDictCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => OptionsDict, optionsDict => optionsDict.category)
    options: OptionsDict[];
}

@Entity()
export class OptionsDict {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column()
    key_db: string;

    @Column()
    value: string;

    @ManyToOne(() => OptionsDictCategory, category => category.options)
    @JoinColumn({ name: 'category_id' })
    category: OptionsDictCategory;
}