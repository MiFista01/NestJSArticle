import { IsArray, IsDate, IsOptional, IsString} from 'class-validator';

export class CreateArticleDto {
    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsArray()
    tags: string;

    @IsArray()
    UserLikes: string;

    @IsString()
    plot: string;

    @IsString()
    slug: string;

    @IsArray()
    author: string;

    @IsDate()
    createdAt: string;

    @IsDate()
    updatedAt: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    body?: string;

    @IsOptional()
    @IsArray()
    tags?: string;

    @IsOptional()
    @IsArray()
    UserLikes?: string;

    @IsOptional()
    @IsString()
    plot?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsArray()
    author?: string;

    @IsOptional()
    @IsDate()
    createdAt?: string;

    @IsOptional()
    @IsDate()
    updatedAt?: string;
}