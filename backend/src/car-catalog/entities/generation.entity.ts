import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { Model } from './model.entity';
import { Configuration } from './configuration.entity';

@Entity('generation')
export class Generation {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, name: 'year-start' })
  yearStart: number;

  @Column({ nullable: true, name: 'year-stop' })
  yearStop: number;

  @Column({ nullable: true, name: 'is-restyle' })
  isRestyle: boolean;

  @ManyToOne(() => Model, model => model.generations)
  @JoinColumn({ name: 'model_id', referencedColumnName:'id' })
  model: Model;

  @OneToMany(() => Configuration, configuration => configuration.generation, { onDelete: 'CASCADE' })
  configurations: Configuration[];
}
