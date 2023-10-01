import { IsDate, IsOptional, IsString} from 'class-validator';

export class CreateCommentsDto {
    @IsString()
    text: string;

    @IsString()
    author: string;

    @IsString()
    article: string;

    @IsDate()
    createdAt: string;

    @IsDate()
    updatedAt: string;

}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsString()
    article?: string;

    @IsOptional()
    @IsDate()
    createdAt?: string;

    @IsOptional()
    @IsDate()
    updatedAt?: string;

}