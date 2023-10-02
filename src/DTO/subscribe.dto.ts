import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateSubscribeDto {
    @ApiProperty({description: 'number of articles per user per month',type: Date, default: 2, required: true})
    @IsNumber()
    price?: number;
}

export class UpdateSubscribeDto {
    @ApiProperty({description: 'cost of purchased subscription',type: Number, default: 2, required: true})
    @IsOptional()
    @IsNumber()
    price?: number;
}