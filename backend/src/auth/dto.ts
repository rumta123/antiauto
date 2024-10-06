import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class SignUpBodyDto {
    @ApiProperty({
        example: 'client@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '1234'
    })
    @IsNotEmpty()
    password: string;
}

export class SignUpSubAccountBodyDto {
    @ApiProperty({example: 'client@example.com'}) @IsEmail() email: string;

    @ApiProperty({ example: '1234' }) @IsNotEmpty() password: string;
    
    @ApiProperty({ example: 'ООО Дилер на Фрунзенской' }) @IsOptional() name: string;
    
    @ApiProperty({ example: 'г. Фрунзенск, ул. Ленина, д. 1' }) @IsOptional() address: string;

    @ApiProperty({ example: '+79111111111' }) @IsOptional() phone: string;

    @ApiProperty({ example: 'Основной аккаунт' }) @IsOptional() comment: string;
}

export class SignInBodyDto {
    @ApiProperty({
        example: 'client@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '1234'
    })
    @IsNotEmpty()
    password: string;
}
export class ResetPasswordBodyDto {
    @ApiProperty({
        example: 'client@example.com'
    })
    @IsEmail()
    email: string;
}

export class ChangePasswordBodyDto {
    @ApiProperty({ example: '1234' }) @IsNotEmpty() password: string;

    @ApiProperty({ example: '1234' }) @IsNotEmpty() newPassword: string;
}
export class EmailBodyDto {
    @ApiProperty({
        example: 'client@example.com'
    })
    @IsEmail()
    email: string;
}
export class AuthResDto {
    @ApiProperty({
        example: 'client@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty()
    isEmailVerified: boolean;
}

export class EmailVerificationDto {
    @ApiProperty({
        example: 'client@example.com',
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    code: string;
}

export class GetSessionInfoDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty({
        // enum:["customer", "seller", "root", "service_desk"]
    })
    type: string;

    @ApiProperty()
    "iat": number;

    @ApiProperty()
    "exp": number;
}



