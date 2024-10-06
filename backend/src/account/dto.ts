import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsOptional } from "class-validator";
import { Accounts } from "./entities/accounts.entity";

export class AccountDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    ownerId: string

    @ApiProperty()
    @IsMobilePhone()
    phone: string

    @ApiProperty()
    name: string

    @ApiProperty()
    lastname: string

    @ApiProperty()
    isPhoneVerified: boolean;

    @ApiProperty()
    accountType: string;
}

export class PatchAccountDto {
    @ApiProperty({required: false})
    id: string
    
    @ApiProperty({
        required: false,
        example: "+79347265382"
    })
    @IsMobilePhone()
    @IsOptional()
    phone: string

    @ApiProperty({
        required: false,
        example: "Oleg Vasnetsov"
    })
    @IsOptional()
    name: string

    @ApiProperty({required: false})
    @IsOptional()
    comment: string;

    @ApiProperty({required: false})
    @IsOptional()
    address: string;

    // @ApiProperty({
    //     required: false,
    //     example: "Vasnetsov"
    // })
    // @IsOptional()
    // lastname: string
}

export class PatchAccountPhoneDto {
    @ApiProperty({
        required: false,
        example: "+79347265382"
    })
    @IsMobilePhone('ru-RU')
    phone: string
}

export class PostAccountPhoneVerifyDto {
    @ApiProperty({
        required: false,
        example: "+79347265382"
    })
    @IsMobilePhone('ru-RU')
    phone: string

    @ApiProperty()
    code: string
}

export class SubAccountDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    name: string;

    @ApiProperty()
    comment: string;

    @ApiProperty()
    address: string;

    constructor(account: Accounts) {
        this.id = account.id;
        this.email = account.owner.email;
        this.phone = account.phone;
        this.createdAt = account.createdAt;
        this.name = account.name;
        this.comment = account.comment;
        this.address = account.address;
    }
}

