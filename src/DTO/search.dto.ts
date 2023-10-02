import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class SearchDto {
    @ApiProperty({description: 'fields',type: [String], default: ["user"], required: true})
    @IsArray()
    fields: string[];

    @ApiProperty({description: 'The bulk of the text',type: [String], default: ["name"], required: true})
    @IsArray()
    keys: string[];

    @ApiProperty({description: 'Tags for this article',type: [String], default: ["le"], required: true})
    @IsArray()
    values?: string[];
}