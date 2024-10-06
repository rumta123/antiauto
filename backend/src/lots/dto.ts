import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { LotsOptionsAttrMap } from "./entities/lots_options_attrmap.entity";

export class LotOptionDto {
    @ApiProperty()
    combined_option_id: string;

    @ApiProperty()
    option_name: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    strict: boolean

    constructor(option: any) {
        this.combined_option_id = option.combined_option_id;
        this.option_name = option.option_name;
        this.value = option.value;
        this.strict = option.strict;
    }
}

export class LotCreateDto {

    @ApiProperty()
    @IsNotEmpty()
    city_id: string;

    @ApiProperty()
    @IsNotEmpty()
    max_distance: number;

    @ApiProperty()
    @IsNotEmpty()
    mark_id: string;

    @ApiProperty()
    @IsNotEmpty()
    model_id: string;

    @ApiProperty()
    @IsNotEmpty()
    generation_id: string;

    @ApiProperty()
    @IsNotEmpty()
    configuration_id: string;

    @ApiProperty()
    @IsNotEmpty()
    engine_hash: string;

    @ApiProperty({ type: [LotsOptionsAttrMap] })
    options: LotsOptionsAttrMap[]
}

export class LotIdDto {
    @ApiProperty()
    lot_uuid: string;

    @ApiProperty()
    lot_id: number;

    constructor(lot: any) {
        this.lot_id = lot.lot_id;
        this.lot_uuid = lot.id;
    }
}

export class LotStatusDto {
    @ApiProperty()
    timestamp: Date;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isLast: boolean;

    constructor(status: any) {
        this.timestamp = status?.timestamp;
        this.name = status?.status?.name;
        this.isLast = status?.status?.isLast;
    }
}
export class LotDto {
    @ApiProperty()
    lot_uuid: string;

    @ApiProperty()
    lot_id: number;

    @ApiProperty()
    is_own: boolean;

    @ApiProperty()
    city: string;

    @ApiProperty()
    max_distance: number;

    @ApiProperty()
    brand: string;

    @ApiProperty()
    brand_logo: string;

    @ApiProperty()
    model: string;

    @ApiProperty()
    configuration: string;

    @ApiProperty()
    configuration_photo: string;

    @ApiProperty()
    @IsNotEmpty()
    engine_hash: string;

    @ApiProperty()
    complectation: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty({type:[LotOptionDto]})
    options: LotOptionDto[] | null;

    @ApiProperty()
    offers_count: number;

    @ApiProperty()
    own_offers_count: number;

    @ApiProperty()
    offers_fit_options: number;

    @ApiProperty()
    offers_min_price: number;

    @ApiProperty()
    status: LotStatusDto

    constructor(lot: any, complectation: string) {
        this.lot_uuid = lot.id;
        this.lot_id = lot.lot_id;
        this.is_own = lot.is_own;
        this.city = lot.city.name;
        this.max_distance = lot.max_distance;
        this.engine_hash = lot.engine_hash;
        this.brand = lot.mark.name;
        this.brand_logo = lot.mark.logo?.image ? Buffer.from(lot.mark.logo.image).toString('base64') : '';
        this.model = lot.generation.model.name;
        this.configuration = `${lot.generation.yearStart} - ${lot.generation.yearStop || 'н.в.'} ${lot.generation.name} ${lot.configuration.bodyType} ${lot.configuration.notice}`;
        this.configuration_photo = lot.configuration.photo?.image ? Buffer.from(lot.configuration.photo.image).toString('base64') : '';
        this.complectation = complectation;
        this.created_at = lot.createdAt;
        this.options = lot.options?.map(option => new LotOptionDto(option));
        this.offers_count = lot.offers?.length;
        this.offers_fit_options = lot.offers?.filter(offer => offer.options?.filter(opt => opt.accordance_type === "unsatisfied").length === 0).length
        this.offers_min_price = lot.offers?.length ? lot.offers?.sort((a, b) => a.price - b.price)[0].price : 0;
        this.own_offers_count = lot.own_offers?.length
        this.status = new LotStatusDto(lot.status);
    }

}



