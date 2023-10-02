import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentsDto {
    @ApiProperty({description: "Comment's text",type: String})
    @IsString()
    text: string;
}

export class UpdateCommentsDto {
    @ApiProperty({description: "Comment's text",type: String})
    @IsOptional()
    @IsString()
    text?: string;

}