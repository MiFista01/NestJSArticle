import { Body, Controller, Get, Param, Post, Delete, UseGuards, Put, Req } from '@nestjs/common';
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { UsersService } from './users.service';
import { Users } from 'src/schemas/users.schemas';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from 'src/DTO/user.dto';
import { validate } from 'class-validator';
import { SubscribeService } from 'src/subscribe/subscribe.service';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}
dotenv.config()
@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
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
            return {user, subscribe}
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
                    const subscribe = await this.subscribeService.searchSubscribes(["user_id"],[""],[req.user._id])
                    const token = jwt.sign(findUser.users[0], process.env.SECRET_KEY,{ expiresIn: '24h' });
                    return token;
                }else{
                    return "wrong password"
                }
            } catch (error) {
                return "not valid password"
            }
        }
    }

    @Get("/all")
    async Users(): Promise<{ users: Users[] }> {
        const users = await this.usersService.findAllUsers();
        return { users }; 
    }
    @Get("entity/:id")
    async User(@Param("id") id:string): Promise<{ user: Users }| null> {
        const user = await this.usersService.findUserById(id);
        return { user }; 
    }
    @Post("search")
    async Search(@Body() formData: any) {
        const users = await this.usersService.searchUsers(formData.search);
        return users
    }

    @Put("/upd")
    async UpdateUser(@Req() req: CustomRequest, @Body() formData: UpdateUserDto) {
        let findUser
        const errors = await validate(UpdateUserDto);
        if (errors.length > 0) {
            return { errors };
        }
        try {
            if(formData.name !== undefined){
                findUser= await this.usersService.searchUsers({
                    name: {value:formData.name, ec: false}
                })
                if (findUser.count != 0){
                    return "you can't update user name because it already exists"
                }else{
                    await this.usersService.updateUser(req.user._id, {name:formData.name});
                    delete formData.name
                }
            }
            if(formData.email !== undefined){
                findUser= await this.usersService.searchUsers({
                    email: {value:formData.email, ec: false}
                })
                if (findUser.count != 0){
                    return "you can't update user email because it already exists"
                }else{
                    await this.usersService.updateUser(req.user._id, {email:formData.email});
                    delete formData.email
                }
            }
            const user = await this.usersService.updateUser(req.user._id, formData);
            return user
        } catch (error) {
            return "data not valid"
        }
    }
    @Get("/out")
    async Out(@Req() req: Request): Promise<string> {
        if (req.headers['token']) {
            delete req.headers['token'];
        }
        return "logout"; 
    }
    @Delete("/del")
    async Delete(@Req() req: CustomRequest): Promise<string> {
        const user = await this.usersService.deleteUser(req.user._id);
        return "user deleted"; 
    }
}
