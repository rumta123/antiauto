import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { Mark } from './mark.entity';
import { Generation } from './generation.entity';

@Entity('model')
export class Model {

    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true, name: 'cyrillic-name' })
    cyrillicName: string;

    @Column({ nullable: true })
    class: string;

    @Column({ nullable: true, name: 'year-from' })
    yearFrom: number;

    @Column({ nullable: true, name: 'year-to' })
    yearTo: number;

    @ManyToOne(() => Mark, mark => mark.models)
    @JoinColumn({ name: "mark_id",  referencedColumnName: "id" })
    mark: Mark;

    @OneToMany(() => Generation, generation => generation.model, { onDelete: 'CASCADE' })
    generations: Generation[];
}
