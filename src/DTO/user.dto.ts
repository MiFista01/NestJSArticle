import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({description: 'name for registration',type: String, default: "filin", required: true})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({description: 'email for registration',type: String, default: "filin@gmail.com", required: true})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({description: "user's bio",type: String, default: "i am not programmer", required: false})
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({description: "user's image",type: String, default: "http://image.ico", required: false})
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({description: 'password',type: String, default: "1234", required: true})
    @IsString()
    @IsNotEmpty()
    password: string;

}

export class UpdateUserDto {
    @ApiProperty({description: 'name for update',type: String, default: "fil", required: false})
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({description: 'email for update',type: String, default: "fil@gmail.com", required: false})
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({description: "user's bio",type: String, default: "HEEEEEEEEEELP", required: false})
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({description: "user's image",type: String, default: "http://image.ico", required: false})
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({description: 'password',type: String, default: "1234", required: false})
    @IsOptional()
    @IsString()
    password?: string;
}

export class AuthUserDto {
    @ApiProperty({description: 'email for update',type: String, default: "aleksei@gmail.com", required: false})
    @IsOptional()
    @IsEmail()
    @ValidateIf((o) => o.name === undefined)
    user?: string;

    @ApiProperty({description: 'password',type: String, default: "1234", required: false})
    @IsOptional()
    @IsString()
    password?: string;
}