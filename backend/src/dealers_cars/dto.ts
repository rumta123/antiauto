import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";
import { DealersCarOptionsAttrMap } from "./entities/dealers_cars_options_attr_map.entity";
import { DealersCarsPhotos } from "./entities/dealers_cars_photos.entity";
import { LotDto } from "src/lots/dto";

export class PatchDealersCarDto {

    @ApiProperty()
    // @IsNotEmpty()
    id: string;

    @ApiProperty({required: false})
    year: number;

    @ApiProperty({required: false})
    mileage: number;

    @ApiProperty()
    isMileageAbroad: boolean;

    @ApiProperty({required: false})
    vin: string;

    @ApiProperty({required: false})
    city_id: string;

    @ApiProperty({required: false})
    city_name: string;

    @ApiProperty()
    brand_id: string;

    @ApiProperty()
    model_id: string;

    @ApiProperty()
    generation_id: string;

    @ApiProperty()
    configuration_id: string;

    @ApiProperty({required: false})
    complectation_id: string;

    @ApiProperty()
    engine_hash: string;

    @ApiProperty({ type: [DealersCarOptionsAttrMap] })
    options: DealersCarOptionsAttrMap[]

    @ApiProperty({ type: [DealersCarsPhotos] })
    photos: DealersCarsPhotos[]
}

export class DealersCarIdDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    sequence: number;

    constructor(car: any) {
        this.id = car.id;
        this.sequence = car.sequence;
    }
}

export class DealersCarOptionDto {
    @ApiProperty()
    combined_option_id: string;

    @ApiProperty()
    option_name: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    value_type: string;

    @ApiProperty()
    dealer_car_id: string;

    @ApiProperty()
    is_complectation_option: boolean

    constructor(option: any) {
        this.combined_option_id = option.combined_option_id;
        this.option_name = option.option_name;
        this.value = option.value;
        this.value_type = option.value_type;
        this.dealer_car_id = option.dealer_car_id;
        this.is_complectation_option = option.is_complectation_option;
    }
}

export class DealersCarPhotoDto {
    @ApiProperty() image: string;
    constructor(photo:any) {
        this.image = photo?.image ? Buffer.from(photo.image).toString('base64') : '';
    }
}

export class DealersCarDto {

    @ApiProperty() id: string;

    @ApiProperty() sequence: number;

    @ApiProperty() year: number;

    @ApiProperty() mileage: number;

    @ApiProperty() vin: string;

    @ApiProperty() city: string;

    @ApiProperty()
    brand: string;
    @ApiProperty()
    brand_id: string;

    @ApiProperty()
    model: string;
    @ApiProperty()
    model_id: string;

    @ApiProperty() generation: string;
    @ApiProperty() generation_id: string;

    @ApiProperty() configuration: string;
    @ApiProperty() configuration_id: string;

    @ApiProperty() complectation: string;
    @ApiProperty() complectation_id: string;

    @ApiProperty() engine_hash: string;

    @ApiProperty({ type: [DealersCarOptionDto] }) options: DealersCarOptionDto[]

    @ApiProperty({ type: [LotDto] }) lots: LotDto[];

    @ApiProperty({ type: [LotDto] }) fittableLots: LotDto[];

    @ApiProperty() status: string;

    @ApiProperty() is_own: boolean;

    @ApiProperty() is_verified: boolean;

    @ApiProperty() is_filled: boolean;

    @ApiProperty() isMileageAbroad: boolean;

    @ApiProperty() photo: string;//DealersCarPhotoDto;

    constructor(car: any, userId?: string) {
        this.id = car.id;

        this.sequence = car.sequence;
        this.year = car.year;
        this.mileage = car.mileage;
        this.vin = car.vin;
        this.city = car.city?.name;
        this.brand = car.brand?.name;
        this.brand_id = car.brand?.id
        this.model = car.model?.name;
        this.model_id = car.model?.id;
        this.is_own = !!userId && car.user_id === userId;
        this.generation_id = car.generation?.id;
        this.configuration = (car.generation && car.configuration) ? `${car.generation.yearStart} - ${car.generation.yearStop || 'н.в.'} ${car.generation.name} ${car.configuration.bodyType} ${car.configuration.notice}` : '';
        this.configuration_id = car.configuration?.id;
        this.complectation = car.complectation
            ? `${[
                [
                    (car.complectation.groupName?.length ? (car.complectation.groupName + ',') : ''),
                    car.complectation.specifications.volumeLitres.toFixed(1),
                    (car.complectation.specifications.horsePower ? `${car.complectation.specifications.horsePower} л.с.` : ''),
                    car.complectation.specifications.engineType
                ].join(' '),
                car.complectation.specifications.transmission,
                car.complectation.specifications.drive,
                `расход ${car.complectation.specifications.consumptionCity} / ${car.complectation.specifications.consumptionHiway} л.`,
                `разгон до 100 - ${car.complectation.specifications.timeTo100} с`
            ].join(', ')}`
            : "";
        this.complectation_id = car.complectation?.complectationId;
        this.engine_hash = car.complectation?.engine_hash;
        this.lots = car.lots;
        this.fittableLots = car.fittableLots;
        // const statuses = ["deal", 'sold', 'selected', 'created']
        // this.status = statuses[Math.floor(Math.random() * statuses.length)]
        this.options = car.options?.map(option => new DealersCarOptionDto(option));
        this.is_verified = car.isVerified;
        this.is_filled = car.isFilled;
        this.isMileageAbroad = car.isMileageAbroad;
        this.photo = car.photo;
    }
}

export class DealersCarPublicDto {

    @ApiProperty()
    id: string;

    @ApiProperty()
    year: number;

    @ApiProperty()
    mileage: number;

    @ApiProperty()
    city: string;

    @ApiProperty()
    brand: string;
    @ApiProperty()
    brand_id: string;

    @ApiProperty()
    model: string;
    @ApiProperty()
    model_id: string;

    @ApiProperty()
    generation: string;
    @ApiProperty()
    generation_id: string;

    @ApiProperty()
    configuration: string;
    @ApiProperty()
    configuration_id: string;

    @ApiProperty()
    complectation: string;
    @ApiProperty()
    complectation_id: string;

    @ApiProperty()
    engine_hash: string;

    @ApiProperty({ type: [DealersCarOptionDto] })
    options: DealersCarOptionDto[]

    @ApiProperty()
    auctions: any[]

    @ApiProperty()
    fittableAuctions: any[]

    @ApiProperty()
    status: string;

    @ApiProperty()
    isMileageAbroad: boolean;

    @ApiProperty()
    photo: string;

    constructor(car: any) {
        this.id = car.id;

        this.year = car.year;
        this.mileage = car.mileage;

        this.city = car.city.name;
        this.brand = car.brand.name;
        this.brand_id = car.brand.id
        this.model = car.model.name;
        this.model_id = car.model.id;
        // this.generation = car.id;
        this.generation_id = car.generation.id;
        this.configuration = `${car.generation.yearStart} - ${car.generation.yearStop || 'н.в.'} ${car.configuration?.bodyType} ${car.configuration?.notice}`;
        this.configuration_id = car.configuration.id;
        this.complectation = `${[
            [
                (car.complectation.groupName?.length ? (car.complectation?.groupName + ',') : ''),
                car.complectation.specifications?.volumeLitres.toFixed(1),
                (car.complectation.specifications?.horsePower ? `${car.complectation.specifications?.horsePower} л.с.` : ''),
                car.complectation.specifications?.engineType
            ].join(' '),
            car.complectation.specifications.transmission,
            car.complectation.specifications.drive,
            `расход ${car.complectation.specifications.consumptionCity} / ${car.complectation.specifications.consumptionHiway} л.`,
            `разгон до 100 - ${car.complectation.specifications.timeTo100} с`
        ].join(', ')}`
        this.complectation_id = car.complectation.complectationId;
        this.engine_hash = car.complectation.engine_hash;
        this.auctions = new Array(Math.floor(Math.random() * 6))
        this.fittableAuctions = new Array(Math.floor(Math.random() * 6))
        const statuses = ["deal", 'sold', 'selected', 'created']
        this.status = statuses[Math.floor(Math.random() * statuses.length)]
        this.options = car.options.map(option => new DealersCarOptionDto(option));
        this.isMileageAbroad = car.isMileageAbroad;
        this.photo = car.photo?.image ? Buffer.from(car.photo.image).toString('base64') : '';
    }
}