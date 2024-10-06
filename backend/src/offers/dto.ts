import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { BaseResDto } from "src/base-dto";
import { OffersStatusesMap } from "./entities/offers_statuses_map.entity";
import { DealersCarDto, DealersCarPublicDto } from "src/dealers_cars/dto";
import { OfferOptionsAttrMap } from "./entities/offers_options_attr_map.entity";
import { Offers } from "./entities/offers.entity";

export class OfferOptionDto {
    @ApiProperty()
    combined_option_id: string;

    @ApiProperty()
    accordance_type: string;

    @ApiProperty()
    option_name: string;

    @ApiProperty()
    value: string;

    constructor(option: OfferOptionsAttrMap) {
        this.combined_option_id = option.combined_option_id;
        this.accordance_type = option.accordance_type;
        this.option_name = option.option_name;
        this.value = option.value;
    }
}

export class OfferCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    lot_id: string;

    @ApiProperty()
    @IsNotEmpty()
    dealers_car_id: string;

    @ApiProperty({ type: DealersCarDto })
    @IsNotEmpty()
    dealers_car: DealersCarDto;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty({  type: 'string', format: 'date-time', nullable: true })
    priceValidTill: Date | null;

    @ApiProperty({ default: 0 })
    waiting: number;

    @ApiProperty({ default: false })
    isCreditAvailable: boolean;

    @ApiProperty({ default: false })
    isInsuranceAvailable: boolean;

    @ApiProperty({ default: false })
    isTradeinAvailable: boolean;

    @ApiProperty({ type: [OfferOptionDto] })
    options: OfferOptionDto[];

    @ApiProperty()
    city_id: string;
}

export class OffersStatusDto {
    @ApiProperty()
    timestamp: Date;

    @ApiProperty()
    name: string;

    @ApiProperty()
    name_cyrillic: string;

    @ApiProperty()
    isLast: boolean;

    @ApiProperty()
    isVisibleForBuyer: boolean;

    constructor(status: any) {
        this.timestamp = status?.timestamp;
        this.name = status?.status?.name;
        this.name_cyrillic = status?.status?.nameCyrillic;
        this.isLast = status?.status?.isLast;
        this.isVisibleForBuyer = status?.status?.isVisibleForBuyer;
    }
}

export class OfferDto implements BaseResDto {

    @ApiProperty()
    id: string;

    @ApiProperty()
    sequence: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    lot_id: string;

    @ApiProperty()
    dealers_car_id: string;

    @ApiProperty()
    dealer_rating: number;

    @ApiProperty()
    is_own: boolean;

    @ApiProperty()
    price: number;

    @ApiProperty({ nullable: true })
    priceValidTill: Date | null;

    @ApiProperty({ default: 0 })
    waiting: number;

    @ApiProperty({ default: false })
    isCreditAvailable: boolean;

    @ApiProperty({ default: false })
    isInsuranceAvailable: boolean;

    @ApiProperty({ default: false })
    isTradeinAvailable: boolean;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    message?: any;

    @ApiProperty()
    status: OffersStatusDto

    @ApiProperty()
    car: DealersCarDto | DealersCarPublicDto;

    @ApiProperty({ type: [OfferOptionDto] })
    options: OfferOptionDto[];

    constructor(offer: any) {
        this.id = offer.id;
        this.sequence = offer.sequence;
        this.created_at = offer.createdAt;
        this.lot_id = offer.lot_id;
        this.dealers_car_id = offer.dealer_car_id;
        this.dealer_rating = 5; //TODO: 
        this.is_own = offer?.dealers_car?.is_own || false;
        this.price = offer.price;
        this.priceValidTill = offer.price_valid_till;
        this.waiting = offer.waiting;
        this.isCreditAvailable = offer.isCreditAvailable;
        this.isInsuranceAvailable = offer.isInsuranceAvailable;
        this.isTradeinAvailable = offer.isTradeinAvailable;
        this.status = new OffersStatusDto(offer.status);
        this.car = offer?.dealers_car;
        this.options = offer.options;
        this.distance = offer.distance ? Math.round(offer.distance/1000) : 0;
    }
}
export class OfferIdDto {

    @ApiProperty()
    id: string;

    @ApiProperty()
    lot_id: string;

    constructor(offer: any) {
        this.id = offer.id;
        this.lot_id = offer.lot_id;
    }
}