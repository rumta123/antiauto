import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToMany, OneToOne, PrimaryColumn, Index } from 'typeorm';
import { Modification } from './modification.entity';

@Entity('specifications')
export class Specifications {
    @Index()
    @PrimaryColumn({ name: 'complectation_id' })
    complectationId: string;

    @Column({ nullable: true, name: 'back-brake' })
    backBrake: string;

    @Column({ nullable: true, name: 'feeding' })
    feeding: string;

    @Column({ nullable: true, name: 'horse-power' })
    horsePower: number;

    @Column({ nullable: true, name: 'kvt-power' })
    kvtPower: number;

    @Column({ nullable: true, name: 'rpm-power' })
    rpmPower: string;

    @Column({ nullable: true, name: 'engine-type' })
    engineType: string;

    @Column({ nullable: true, name: 'transmission' })
    transmission: string;

    @Column({ nullable: true, name: 'drive' })
    drive: string;

    @Column({ nullable: true, name: 'volume' })
    volume: number;

    @Column({ nullable: true, name: 'time-to-100', type: 'float' })
    timeTo100: number;

    @Column({ nullable: true, name: 'cylinders-order' })
    cylindersOrder: string;

    @Column({ nullable: true, name: 'max-speed' })
    maxSpeed: number;

    @Column({ nullable: true, name: 'compression', type: 'float' })
    compression: number;

    @Column({ nullable: true, name: 'cylinders-value' })
    cylindersValue: number;

    @Column({ nullable: true, name: 'diametr', type: 'float' })
    diametr: number;

    @Column({ nullable: true, name: 'piston-stroke', type: 'float' })
    pistonStroke: number;

    @Column({ nullable: true, name: 'engine-feeding' })
    engineFeeding: string;

    @Column({ nullable: true, name: 'engine-order' })
    engineOrder: string;

    @Column({ nullable: true, name: 'gear-value' })
    gearValue: number;

    @Column({ nullable: true, name: 'moment', type: 'float' })
    moment: number;

    @Column({ nullable: true, name: 'petrol-type' })
    petrolType: string;

    @Column({ nullable: true, name: 'valves' })
    valves: number;

    @Column({ nullable: true, name: 'weight', type: 'float' })
    weight: number;

    @Column({ nullable: true, name: 'wheel-size' })
    wheelSize: string;

    @Column({ nullable: true, name: 'wheel-base' })
    wheelBase: number;

    @Column({ nullable: true, name: 'front-wheel-base' })
    frontWheelBase: number;

    @Column({ nullable: true, name: 'back-wheel-base' })
    backWheelBase: number;

    @Column({ nullable: true, name: 'front-brake' })
    frontBrake: string;

    @Column({ nullable: true, name: 'front-suspension' })
    frontSuspension: string;

    @Column({ nullable: true, name: 'back-suspension' })
    backSuspension: string;

    @Column({ nullable: true, name: 'height' })
    height: number;

    @Column({ nullable: true, name: 'width' })
    width: number;

    @Column({ nullable: true, name: 'fuel-tank-capacity' })
    fuelTankCapacity: number;

    @Column({ nullable: true, name: 'seats' })
    seats: string;

    @Column({ nullable: true, name: 'length' })
    length: number;

    @Column({ nullable: true, name: 'doors-count' })
    doorsCount: number;

    @Column({ nullable: true, name: 'emission-euro-class' })
    emissionEuroClass: string;

    @Column({ nullable: true, name: 'volume-litres', type: 'float' })
    volumeLitres: number;

    @Column({ nullable: true, name: 'consumption-mixed', type: 'float' })
    consumptionMixed: number;

    @Column({ nullable: true, name: 'clearance' })
    clearance: string;

    @Column({ nullable: true, name: 'trunks-min-capacity' })
    trunksMinCapacity: string;

    @Column({ nullable: true, name: 'trunks-max-capacity' })
    trunksMaxCapacity: number;

    @Column({ nullable: true, name: 'consumption-hiway', type: 'float' })
    consumptionHiway: number;

    @Column({ nullable: true, name: 'consumption-city', type: 'float' })
    consumptionCity: number;

    @Column({ nullable: true, name: 'moment-rpm' })
    momentRpm: string;

    @Column({ nullable: true, name: 'full-weight' })
    fullWeight: number;

    @Column({ nullable: true, name: 'range-distance' })
    rangeDistance: number;

    @Column({ nullable: true, name: 'battery-capacity', type: 'float' })
    batteryCapacity: number;

    @Column({ nullable: true, name: 'fuel-emission' })
    fuelEmission: number;

    @Column({ nullable: true, name: 'electric-range' })
    electricRange: number;

    @Column({ nullable: true, name: 'charge-time', type: 'float' })
    chargeTime: number;

    @Column({ nullable: true, name: 'safety-rating' })
    safetyRating: string;

    @Column({ nullable: true, name: 'safety-grade', type: 'float' })
    safetyGrade: number;

    @OneToOne(() => Modification, modification => modification.specifications)
    @JoinColumn({ name: 'complectation_id' })
    modification: Modification;
}
