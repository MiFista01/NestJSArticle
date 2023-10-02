import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class SearchDto {
    @ApiProperty({description: 'fields',type: [String]})
    @IsArray()
    fields: string[];

    @ApiProperty({description: 'The bulk of the text',type: [String]})
    @IsArray()
    keys: string[];

    @ApiProperty({description: 'Tags for this article',type: [String]})
    @IsArray()
    values?: string[];
}