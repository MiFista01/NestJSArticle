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
    @Delete(':id')
    async DeleteUser(@Param('id') id: string): Promise<void> {
        await this.usersService.deleteUser(id);
    }
}
