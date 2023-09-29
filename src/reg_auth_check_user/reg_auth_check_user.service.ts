import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/users.schemas';
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
dotenv.config()
@Injectable()
export class RegAuthCheckUserService {
    constructor(
        @InjectModel('Users') private readonly userModel: Model<Users>,
    ) { }
    async checkJWT(token: string): Promise<jwt.JwtPayload | null> {
        try {
            const user = await jwt.verify(token, process.env.SECRET_KEY);
            return user as jwt.JwtPayload;
        } catch (error) {
            // Обработка ошибки, например, возвращение null в случае недействительного токена.
            return null;
        }
    }
}
