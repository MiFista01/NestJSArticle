import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsString} from 'class-validator';

export class CreateArticleDto {
    @ApiProperty({description: 'Article title',type: String, default: "Article very nice", required: true})
    @IsString()
    title: string;

    @ApiProperty({description: 'The bulk of the text',type: String, default: "AAAAAA?", required: true})
    @IsString()
    body: string;

    @ApiPropertyOptional({description: 'Tags for this article',type: [String], default: ["article"], required: false})
    @IsOptional()
    @IsArray()
    tags?: string[];

    @ApiProperty({description: 'Short text for starters',type: String, default: "no?", required: true})
    @IsString()
    plot: string;
}

export class UpdateArticleDto {
    @ApiPropertyOptional({description: 'Article title',type: String, default: "Article very nice", required: false})
    @IsOptional()
    @IsString()
    title?: string;


    @ApiPropertyOptional({description: 'The bulk of the text',type: String, default: "AAAAAA?", required: false})
    @IsOptional()
    @IsString()
    body?: string;


    @ApiPropertyOptional({description: 'Tags for this article',type: [String], default: ["article"], required: false})
    @IsOptional()
    @IsArray()
    tags?: string[];


    @ApiPropertyOptional({description: 'Short text for starters',type: String, default: "no?", required: false})
    @IsOptional()
    @IsString()
    plot?: string;
}