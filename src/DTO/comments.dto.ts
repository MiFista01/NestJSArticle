import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString} from 'class-validator';

export class CreateCommentsDto {
    @ApiProperty({description: "Comment's text",type: String, default: "Very cool article", required: true})
    @IsString()
    text: string;
}

export class UpdateCommentsDto {
    @ApiProperty({description: "Comment's text",type: String, default: "No this article not good", required: true})
    @IsOptional()
    @IsString()
    text?: string;

}