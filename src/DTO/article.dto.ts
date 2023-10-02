import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString} from 'class-validator';
import { Types } from 'mongoose';

export class CreateArticleDto {
    @ApiProperty({description: 'Article title',type: String})
    @IsString()
    title: string;

    @ApiProperty({description: 'The bulk of the text',type: String})
    @IsString()
    body: string;

    @ApiPropertyOptional({description: 'Tags for this article',type: [String]})
    @IsOptional()
    @IsArray()
    tags?: string[];

    @ApiProperty({description: 'Short text for starters',type: String})
    @IsString()
    plot: string;
}

export class UpdateArticleDto {
    @ApiPropertyOptional({description: 'Article title',type: String})
    @IsOptional()
    @IsString()
    title?: string;


    @ApiPropertyOptional({description: 'The bulk of the text',type: String})
    @IsOptional()
    @IsString()
    body?: string;


    @ApiPropertyOptional({description: 'Tags for this article',type: [String]})
    @IsOptional()
    @IsArray()
    tags?: string[];


    @ApiPropertyOptional({description: 'Short text for starters',type: String})
    @IsOptional()
    @IsString()
    plot?: string;
}