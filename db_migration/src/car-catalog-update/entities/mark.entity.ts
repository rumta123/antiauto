import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn, OneToOne } from 'typeorm';
import { Model } from './model.entity';
import { MarkLogo } from './marklogo.entity';

@Entity('mark')
export class Mark {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true, name: 'cyrillic-name' })
    cyrillicName: string;

    @Column({ nullable: true })
    popular: boolean;

    @Column({ nullable: true })
    country: string;

    @OneToMany(() => Model, model => model.mark, { onDelete: 'CASCADE' })
    models: Model[];

    @OneToOne(() => MarkLogo, markLogo => markLogo.mark, { onDelete: 'CASCADE' })
    logo: MarkLogo;
}
