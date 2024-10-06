import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Modification } from './modification.entity';
import { Configuration } from './configuration.entity';

@Entity('configurations_photo')
export class ConfigurationsPhoto {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "bytea", nullable: true })
    image: Buffer | null;

    @OneToOne(() => Configuration, configuration => configuration.photo)
    @JoinColumn({ name: 'configurationId' })
    configuration: Configuration;

}