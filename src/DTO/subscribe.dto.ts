import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateSubscribeDto {
    @ApiPropertyOptional({description: 'User who have subscribe',type: String})
    @IsString()
    user_id: string;

    @ApiPropertyOptional({description: 'Type of subscribe',type: String})
    @IsString()
    sub_id: string;


    @ApiProperty({description: 'start of subscription',type: Date})
    @IsString()
    start: Date;
    

    @ApiProperty({description: 'end of subscription in month',type: Date})
    @IsString()
    monthEnd: Date;
    

    @ApiProperty({description: 'end of subscription',type: Date})
    @IsString()
    subscribeEnd: Date;
    

    @ApiPropertyOptional({description: 'number of articles per user per month',type: Date})
    @IsNumber()
    countArticles: number;
}

export class UpdateSubscribeDto {
    @ApiPropertyOptional({description: 'User who have subscribe',type: String})
    @IsOptional()
    @IsString()
    user_id?: string;

    @ApiPropertyOptional({description: 'Type of subscribe',type: String})
    @IsOptional()
    @IsString()
    sub_id?: string;

    @ApiProperty({description: 'start of subscription',type: Date})
    @IsOptional()
    @IsString()
    start?: Date;

    @ApiProperty({description: 'end of subscription in month',type: Date})
    @IsOptional()
    @IsString()
    monthEnd?: Date;

    @ApiProperty({description: 'end of subscription',type: Date})
    @IsOptional()
    @IsString()
    subscribeEnd?: Date;

    @ApiPropertyOptional({description: 'number of articles per user per month',type: Date})
    @IsOptional()
    @IsNumber()
    countArticles?: number;

    @ApiPropertyOptional({description: 'cost of purchased subscription',type: Number})
    @IsOptional()
    @IsNumber()
    price?: number;
}