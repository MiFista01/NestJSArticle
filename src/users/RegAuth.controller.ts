import { Body, Controller, Get, Param, Post, Delete, UseGuards, Put, Req } from '@nestjs/common';
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { UsersService } from './users.service';
import { Users } from 'src/schemas/users.schemas';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { Types } from 'mongoose';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}
dotenv.config()
@Controller()
export class RegAuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly subscribeService: SubscribeService
    ) {}

    @Post("/reg")
    async CreateUser(@Body() formData: any) {
        const findUser = await this.usersService.searchUsers({
            name: {value:formData.name, ec: false},
            email: {value:formData.email, ec: false}})
        if (findUser.count != 0){
            return "user already exists"
        }else{
            const user = await this.usersService.createUser(formData);
            const subscribe = await this.subscribeService.createFreeSubscribe(user._id)
            return { subscribe}
        }
    }
    @Post("/in")
    async AuthUser(@Req() req: CustomRequest, @Body() formData: any) {
        const findUser = await this.usersService.searchUsers(formData.user)
        if(findUser.count == 0){
            return "wrong username or email"
        }else{
            try {
                const checkPassword = await bcrypt.compare(formData.password, findUser.users[0].password)
                if(checkPassword){
                    delete findUser.users[0].password
                    const subscribe = await this.subscribeService.searchSubscribes(["user_id"],[""],[findUser.users[0]._id])
                    const token = jwt.sign({
                        user:findUser.users[0]._id,
                        subscribe:subscribe.subscribes[0]._id
                    }, process.env.SECRET_KEY,{ expiresIn: '24h' });
                    return token;
                }else{
                    return "wrong password"
                }
            } catch (error) {
                return "not valid password"
            }
        }
    }
}
