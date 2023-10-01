import { IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateSubscribeDto {
    @IsString()
    user_id: string;

    @IsString()
    sub_id: string;

    @IsString()
    start: string;

    @IsString()
    monthEnd: string;

    @IsString()
    subscribeEnd: string;

    @IsNumber()
    countArticles: number;
}

export class UpdateSubscribeDto {
    @IsOptional()
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsString()
    sub_id?: string;

    @IsOptional()
    @IsString()
    start?: string;

    @IsOptional()
    @IsString()
    monthEnd?: string;

    @IsOptional()
    @IsString()
    subscribeEnd?: string;

    @IsOptional()
    @IsNumber()
    countArticles?: number;
}