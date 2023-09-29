import { Body, Controller, Get, Param, Post, Delete, Put, Redirect } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from 'src/schemas/users.schemas';
import * as jwt from "jsonwebtoken"
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config()

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("/reg")
    async CreateUser(@Body() formData: any) {
        const findUser = await this.usersService.searchUsers({
            name: {value:formData.name, ec: false},
            email: {value:formData.email, ec: false}})
        if (findUser.count != 0){
            return "user already exists"
        }else{
            const user = await this.usersService.createUser(formData);
            return user
        }
    }
    @Post("/in")
    async AuthUser(@Body() formData: any) {
        const findUser = await this.usersService.searchUsers(formData.search)
        if(findUser == undefined){
            return "wrong username or email"
        }else{
            try {
                const checkPassword = await bcrypt.compare(formData.password, findUser.users[0].password)
                if(checkPassword){
                    delete findUser.users[0].password
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
    @Put("/upd")
    async UpdateUser(@Body() formData: any) {
        let findUser
        if(formData.updateData.name !== undefined){
            findUser= await this.usersService.searchUsers({
                name: {value:formData.updateData.name, ec: false}
            })
            if (findUser.count != 0){
                return "you can't update user name because it already exists"
            }else{
                await this.usersService.updateUser(formData.id, {name:formData.updateData.name});
                delete formData.updateData.name
            }
        }
        if(formData.updateData.email !== undefined){
            findUser= await this.usersService.searchUsers({
                email: {value:formData.updateData.email, ec: false}
            })
            if (findUser.count != 0){
                return "you can't update user email because it already exists"
            }else{
                await this.usersService.updateUser(formData.id, {email:formData.updateData.email});
                delete formData.updateData.email
            }
        }
        const user = await this.usersService.updateUser(formData.id, formData.updateData);
        return user
    }
    @Delete('profile/:id')
    async DeleteUser(@Param('id') id: string): Promise<void> {
        await this.usersService.deleteUser(id);
    }

    @Get("/all")
    async Users(@Param("page") page:string): Promise<{ users: Users[] }> {
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
}
