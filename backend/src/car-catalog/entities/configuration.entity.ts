import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn, OneToOne } from 'typeorm';
import { Generation } from './generation.entity';
import { Modification } from './modification.entity';
import { ConfigurationsPhoto } from './configurations_photo.entity';

@Entity('configuration')
export class Configuration {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true, name: 'doors-count' })
  doorsCount: number;

  @Column({ nullable: true, name: 'body-type' })
  bodyType: string;

  @Column({ nullable: true })
  notice: string;

  @Column()
  hash: string;

  @ManyToOne(() => Generation, generation => generation.configurations)
  generation: Generation;

  @OneToMany(() => Modification, modification => modification.configuration, { onDelete: 'CASCADE' })
  modifications: Modification[];

  @OneToOne(() => ConfigurationsPhoto, configurationsPhoto => configurationsPhoto.configuration, { onDelete: 'CASCADE' })
  photo: ConfigurationsPhoto;
}
