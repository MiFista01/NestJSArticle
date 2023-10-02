import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({description: 'name for registration',type: String})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({description: 'email for registration',type: String})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({description: "user's bio",type: String})
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({description: "user's image",type: String})
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({description: 'password',type: String})
    @IsString()
    @IsNotEmpty()
    password: string;

}

export class UpdateUserDto {
    @ApiProperty({description: 'name for update',type: String})
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({description: 'email for update',type: String})
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({description: "user's bio",type: String})
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({description: "user's image",type: String})
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({description: 'password',type: String})
    @IsOptional()
    @IsString()
    password?: string;
}

export class AuthUserDto {
    @ApiProperty({description: 'name for update',type: String})
    @IsOptional()
    @IsString()
    @ValidateIf((o) => o.email === undefined)
    name?: string;

    @ApiProperty({description: 'email for update',type: String})
    @IsOptional()
    @IsEmail()
    @ValidateIf((o) => o.name === undefined)
    email?: string;

    @ApiProperty({description: 'password',type: String})
    @IsOptional()
    @IsString()
    password?: string;
}