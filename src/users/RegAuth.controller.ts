import { Body, Controller, Post, Req } from '@nestjs/common';
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { UsersService } from './users.service';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { validate } from 'class-validator';
import { AuthUserDto, CreateUserDto } from 'src/DTO/user.dto';
import { Subscribe } from '../schemas/subscribe.schemas';
import { Users } from 'src/schemas/users.schemas';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}
dotenv.config()
@Controller("api")
@ApiTags('guest')
export class RegAuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly subscribeService: SubscribeService
    ) {}

    @Post("/users")
    @ApiOperation({ summary: 'User registration', description: "Return new user item" })
    async CreateUser(@Body() formData: CreateUserDto) {
        const findUser = await this.usersService.searchUsers({
            name: {value:formData.name, ec: false},
            email: {value:formData.email, ec: false}})
        if (findUser.count != 0){
            return "user already exists"
        }else{
            const errors = await validate(CreateUserDto);
            if (errors.length > 0) {
                return { errors };
            }
            const user = await this.usersService.createUser(formData as Users);
            const subscribe = await this.subscribeService.createFreeSubscribe(user._id)
            if((subscribe as Subscribe)._id == undefined){
                await this.usersService.deleteUser(user._id)
                return "error with registration"
            }
            return { subscribe}
        }
    }
    @Post("/users/login")
    @ApiOperation({ summary: 'User authorization', description: "Return token" })
    async AuthUser( @Body() formData: AuthUserDto): Promise<{ user: any }| string> {
        let user = {}
        let continueToPassword = false;
        user["name"] = {"value":formData.user}
        let findUser = await this.usersService.searchUsers(user)
        if(findUser.count == 0){
            user = {}
            user["email"] = {"value":formData.user}
            findUser = await this.usersService.searchUsers(user)
            if(findUser.count == 0){
                continueToPassword = false
            }else{
                continueToPassword = true
            }
        }else{
            continueToPassword = true
        }
        if(!continueToPassword){
            return "wrong username or email"
        }else{
            try {
                const checkPassword = await bcrypt.compare(formData.password, findUser.users[0].password)
                if(checkPassword){
                    delete findUser.users[0].password
                    
                    const subscribe = await this.subscribeService.searchSubscribes(["user_id"],[""],[findUser.users[0]._id])
                    const token = jwt.sign({
                        user:findUser.users[0],
                        subscribe:subscribe.subscribes[0]._id
                    }, process.env.SECRET_KEY,{ expiresIn: '24h' });
                    findUser.users[0]["token"] = token
                    delete findUser.users[0]._id
                    return {user:findUser.users[0]};
                }else{
                    return "wrong password"
                }
            } catch (error) {
                return "not valid password"
            }
        }
    }
}
