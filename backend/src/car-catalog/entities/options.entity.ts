import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, PrimaryColumn, Index } from 'typeorm';
import { Modification } from './modification.entity';

@Entity('options')
export class Options {
    @Index() 
    @PrimaryColumn( { name: 'complectation_id' })
    complectationId: string;

    @Column({ nullable: true, name: 'alcantara' })
    alcantara: string;

    @Column({ nullable: true, name: 'black-roof' })
    blackRoof: string;

    @Column({ nullable: true, name: 'combo-interior' })
    comboInterior: string;

    @Column({ nullable: true, name: 'decorative-interior-lighting' })
    decorativeInteriorLighting: string;

    @Column({ nullable: true, name: 'door-sill-panel' })
    doorSillPanel: string;

    @Column({ nullable: true, name: 'driver-seat-electric' })
    driverSeatElectric: string;

    @Column({ nullable: true, name: 'driver-seat-memory' })
    driverSeatMemory: string;

    @Column({ nullable: true, name: 'driver-seat-support' })
    driverSeatSupport: string;

    @Column({ nullable: true, name: 'driver-seat-updown' })
    driverSeatUpdown: string;

    @Column({ nullable: true, name: 'eco-leather' })
    ecoLeather: string;

    @Column({ nullable: true, name: 'electro-rear-seat' })
    electroRearSeat: string;

    @Column({ nullable: true, name: 'fabric-seats' })
    fabricSeats: string;

    @Column({ nullable: true, name: 'folding-front-passenger-seat' })
    foldingFrontPassengerSeat: string;

    @Column({ nullable: true, name: 'folding-tables-rear' })
    foldingTablesRear: string;

    @Column({ nullable: true, name: 'front-centre-armrest' })
    frontCentreArmrest: string;

    @Column({ nullable: true, name: 'front-seat-support' })
    frontSeatSupport: string;

    @Column({ nullable: true, name: 'front-seats-heat' })
    frontSeatsHeat: string;

    @Column({ nullable: true, name: 'front-seats-heat-vent' })
    frontSeatsHeatVent: string;

    @Column({ nullable: true, name: 'hatch' })
    hatch: string;

    @Column({ nullable: true, name: 'leather' })
    leather: string;

    @Column({ nullable: true, name: 'leather-gear-stick' })
    leatherGearStick: string;

    @Column({ nullable: true, name: 'massage-seats' })
    massageSeats: string;

    @Column({ nullable: true, name: 'panorama-roof' })
    panoramaRoof: string;

    @Column({ nullable: true, name: 'passenger-seat-electric' })
    passengerSeatElectric: string;

    @Column({ nullable: true, name: 'passenger-seat-updown' })
    passengerSeatUpdown: string;

    @Column({ nullable: true, name: 'rear-seat-heat-vent' })
    rearSeatHeatVent: string;

    @Column({ nullable: true, name: 'rear-seat-memory' })
    rearSeatMemory: string;

    @Column({ nullable: true, name: 'rear-seats-heat' })
    rearSeatsHeat: string;

    @Column({ nullable: true, name: 'roller-blind-for-rear-window' })
    rollerBlindForRearWindow: string;

    @Column({ nullable: true, name: 'roller-blinds-for-rear-side-windows' })
    rollerBlindsForRearSideWindows: string;

    @Column({ nullable: true, name: 'seat-memory' })
    seatMemory: string;

    @Column({ nullable: true, name: 'seat-transformation' })
    seatTransformation: string;

    @Column({ nullable: true, name: 'sport-pedals' })
    sportPedals: string;

    @Column({ nullable: true, name: 'sport-seats' })
    sportSeats: string;

    @Column({ nullable: true, name: 'third-rear-headrest' })
    thirdRearHeadrest: string;

    @Column({ nullable: true, name: 'third-row-seats' })
    thirdRowSeats: string;

    @Column({ nullable: true, name: 'tinted-glass' })
    tintedGlass: string;

    @Column({ nullable: true, name: 'wheel-heat' })
    wheelHeat: string;

    @Column({ nullable: true, name: 'wheel-leather' })
    wheelLeather: string;

    @Column({ nullable: true, name: '360-camera' })
    camera360: string;

    @Column({ nullable: true, name: 'adj-pedals' })
    adjPedals: string;

    @Column({ nullable: true, name: 'ashtray-and-cigarette-lighter' })
    ashtrayAndCigaretteLighter: string;

    @Column({ nullable: true, name: 'auto-cruise' })
    autoCruise: string;

    @Column({ nullable: true, name: 'auto-mirrors' })
    autoMirrors: string;

    @Column({ nullable: true, name: 'auto-park' })
    autoPark: string;

    @Column({ nullable: true, name: 'climate-control-1' })
    climateControl1: string;

    @Column({ nullable: true, name: 'climate-control-2' })
    climateControl2: string;

    @Column({ nullable: true, name: 'computer' })
    computer: string;

    @Column({ nullable: true, name: 'condition' })
    condition: string;

    @Column({ nullable: true, name: 'cooling-box' })
    coolingBox: string;

    @Column({ nullable: true, name: 'cruise-control' })
    cruiseControl: string;

    @Column({ nullable: true, name: 'drive-mode-sys' })
    driveModeSys: string;

    @Column({ nullable: true, name: 'e-adjustment-wheel' })
    eAdjustmentWheel: string;

    @Column({ nullable: true, name: 'easy-trunk-opening' })
    easyTrunkOpening: string;

    @Column({ nullable: true, name: 'electro-mirrors' })
    electroMirrors: string;

    @Column({ nullable: true, name: 'electro-trunk' })
    electroTrunk: string;

    @Column({ nullable: true, name: 'electro-window-back' })
    electroWindowBack: string;

    @Column({ nullable: true, name: 'electro-window-front' })
    electroWindowFront: string;

    @Column({ nullable: true, name: 'electronic-gage-panel' })
    electronicGagePanel: string;

    @Column({ nullable: true, name: 'front-camera' })
    frontCamera: string;

    @Column({ nullable: true, name: 'keyless-entry' })
    keylessEntry: string;

    @Column({ nullable: true, name: 'multi-wheel' })
    multiWheel: string;

    @Column({ nullable: true, name: 'multizone-climate-control' })
    multizoneClimateControl: string;

    @Column({ nullable: true, name: 'park-assist-f' })
    parkAssistF: string;

    @Column({ nullable: true, name: 'park-assist-r' })
    parkAssistR: string;

    @Column({ nullable: true, name: 'power-latching-doors' })
    powerLatchingDoors: string;

    @Column({ nullable: true, name: 'programmed-block-heater' })
    programmedBlockHeater: string;

    @Column({ nullable: true, name: 'projection-display' })
    projectionDisplay: string;

    @Column({ nullable: true, name: 'rear-camera' })
    rearCamera: string;

    @Column({ nullable: true, name: 'remote-engine-start' })
    remoteEngineStart: string;

    @Column({ nullable: true, name: 'servo' })
    servo: string;

    @Column({ nullable: true, name: 'start-button' })
    startButton: string;

    @Column({ nullable: true, name: 'start-stop-function' })
    startStopFunction: string;

    @Column({ nullable: true, name: 'steering-wheel-gear-shift-paddles' })
    steeringWheelGearShiftPaddles: string;

    @Column({ nullable: true, name: 'wheel-configuration1' })
    wheelConfiguration1: string;

    @Column({ nullable: true, name: 'wheel-configuration2' })
    wheelConfiguration2: string;

    @Column({ nullable: true, name: 'wheel-memory' })
    wheelMemory: string;

    @Column({ nullable: true, name: 'wheel-power' })
    wheelPower: string;

    @Column({ nullable: true, name: 'adaptive-light' })
    adaptiveLight: string;

    @Column({ nullable: true, name: 'automatic-lighting-control' })
    automaticLightingControl: string;

    @Column({ nullable: true, name: 'drl' })
    drl: string;

    @Column({ nullable: true, name: 'heated-wash-system' })
    heatedWashSystem: string;

    @Column({ nullable: true, name: 'high-beam-assist' })
    highBeamAssist: string;

    @Column({ nullable: true, name: 'laser-lights' })
    laserLights: string;

    @Column({ nullable: true, name: 'led-lights' })
    ledLights: string;

    @Column({ nullable: true, name: 'light-cleaner' })
    lightCleaner: string;

    @Column({ nullable: true, name: 'light-sensor' })
    lightSensor: string;

    @Column({ nullable: true, name: 'mirrors-heat' })
    mirrorsHeat: string;

    @Column({ nullable: true, name: 'ptf' })
    ptf: string;

    @Column({ nullable: true, name: 'rain-sensor' })
    rainSensor: string;

    @Column({ nullable: true, name: 'windcleaner-heat' })
    windcleanerHeat: string;

    @Column({ nullable: true, name: 'windscreen-heat' })
    windscreenHeat: string;

    @Column({ nullable: true, name: 'xenon' })
    xenon: string;

    @Column({ nullable: true, name: 'abs' })
    abs: string;

    @Column({ nullable: true, name: 'airbag-curtain' })
    airbagCurtain: string;

    @Column({ nullable: true, name: 'airbag-driver' })
    airbagDriver: string;

    @Column({ nullable: true, name: 'airbag-passenger' })
    airbagPassenger: string;

    @Column({ nullable: true, name: 'airbag-rear-side' })
    airbagRearSide: string;

    @Column({ nullable: true, name: 'airbag-side' })
    airbagSide: string;

    @Column({ nullable: true, name: 'asr' })
    asr: string;

    @Column({ nullable: true, name: 'bas' })
    bas: string;

    @Column({ nullable: true, name: 'blind-spot' })
    blindSpot: string;

    @Column({ nullable: true, name: 'collision-prevention-assist' })
    collisionPreventionAssist: string;

    @Column({ nullable: true, name: 'dha' })
    dha: string;

    @Column({ nullable: true, name: 'drowsy-driver-alert-system' })
    drowsyDriverAlertSystem: string;

    @Column({ nullable: true, name: 'esp' })
    esp: string;

    @Column({ nullable: true, name: 'feedback-alarm' })
    feedbackAlarm: string;

    @Column({ nullable: true, name: 'glonass' })
    glonass: string;

    @Column({ nullable: true, name: 'hcc' })
    hcc: string;

    @Column({ nullable: true, name: 'isofix' })
    isofix: string;

    @Column({ nullable: true, name: 'isofix-front' })
    isofixFront: string;

    @Column({ nullable: true, name: 'knee-airbag' })
    kneeAirbag: string;

    @Column({ nullable: true, name: 'laminated-safety-glass' })
    laminatedSafetyGlass: string;

    @Column({ nullable: true, name: 'lane-keeping-assist' })
    laneKeepingAssist: string;

    @Column({ nullable: true, name: 'night-vision' })
    nightVision: string;

    @Column({ nullable: true, name: 'power-child-locks-rear-doors' })
    powerChildLocksRearDoors: string;

    @Column({ nullable: true, name: 'traffic-sign-recognition' })
    trafficSignRecognition: string;

    @Column({ nullable: true, name: 'tyre-pressure' })
    tyrePressure: string;

    @Column({ nullable: true, name: 'vsm' })
    vsm: string;

    @Column({ nullable: true, name: 'alarm' })
    alarm: string;

    @Column({ nullable: true, name: 'immo' })
    immo: string;

    @Column({ nullable: true, name: 'lock' })
    lock: string;

    @Column({ nullable: true, name: 'volume-sensor' })
    volumeSensor: string;

    @Column({ nullable: true, name: '12v-socket' })
    socket12v: string;

    @Column({ nullable: true, name: '220v-socket' })
    socket220v: string;

    @Column({ nullable: true, name: 'android-auto' })
    androidAuto: string;

    @Column({ nullable: true, name: 'apple-carplay' })
    appleCarplay: string;

    @Column({ nullable: true, name: 'audiopreparation' })
    audiopreparation: string;

    @Column({ nullable: true, name: 'audiosystem-cd' })
    audiosystemCd: string;

    @Column({ nullable: true, name: 'audiosystem-tv' })
    audiosystemTv: string;

    @Column({ nullable: true, name: 'aux' })
    aux: string;

    @Column({ nullable: true, name: 'bluetooth' })
    bluetooth: string;

    @Column({ nullable: true, name: 'entertainment-system-for-rear-seat-passengers' })
    entertainmentSystemRearSeatPassengers: string;

    @Column({ nullable: true, name: 'music-super' })
    musicSuper: string;

    @Column({ nullable: true, name: 'navigation' })
    navigation: string;

    @Column({ nullable: true, name: 'usb' })
    usb: string;

    @Column({ nullable: true, name: 'voice-recognition' })
    voiceRecognition: string;

    @Column({ nullable: true, name: 'wireless-charger' })
    wirelessCharger: string;

    @Column({ nullable: true, name: 'ya-auto' })
    yaAuto: string;

    @Column({ nullable: true, name: 'activ-suspension' })
    activSuspension: string;

    @Column({ nullable: true, name: 'air-suspension' })
    airSuspension: string;

    @Column({ nullable: true, name: 'reduce-spare-wheel' })
    reduceSpareWheel: string;

    @Column({ nullable: true, name: 'spare-wheel' })
    spareWheel: string;

    @Column({ nullable: true, name: 'sport-suspension' })
    sportSuspension: string;

    @Column({ nullable: true, name: '14-inch-wheels' })
    inchWheels14: string;

    @Column({ nullable: true, name: '15-inch-wheels' })
    inchWheels15: string;

    @Column({ nullable: true, name: '16-inch-wheels' })
    inchWheels16: string;

    @Column({ nullable: true, name: '17-inch-wheels' })
    inchWheels17: string;

    @Column({ nullable: true, name: '18-inch-wheels' })
    inchWheels18: string;

    @Column({ nullable: true, name: '19-inch-wheels' })
    inchWheels19: string;

    @Column({ nullable: true, name: '20-inch-wheels' })
    inchWheels20: string;

    @Column({ nullable: true, name: '21-inch-wheels' })
    inchWheels21: string;

    @Column({ nullable: true, name: '22-inch-wheels' })
    inchWheels22: string;

    @Column({ nullable: true, name: 'body-kit' })
    bodyKit: string;

    @Column({ nullable: true, name: 'body-mouldings' })
    bodyMouldings: string;

    @Column({ nullable: true, name: 'duo-body-color' })
    duoBodyColor: string;

    @Column({ nullable: true, name: 'paint-metallic' })
    paintMetallic: string;

    @Column({ nullable: true, name: 'roof-rails' })
    roofRails: string;

    @Column({ nullable: true, name: 'steel-wheels' })
    steelWheels: string;

    @OneToOne(() => Modification, modification => modification.options)
    @JoinColumn({ name: 'complectation_id' })
    modification: Modification;
}
