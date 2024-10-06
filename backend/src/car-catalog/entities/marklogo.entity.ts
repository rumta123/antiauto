import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Mark } from './mark.entity';

@Entity('marklogo')
export class MarkLogo {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "bytea", nullable: true })
    image: Buffer | null;

    @OneToOne(() => Mark, mark => mark.logo)
    @JoinColumn({ name: 'markId' })
    mark: Mark;
}