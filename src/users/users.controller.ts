import { Body, Controller, Get, Param, Post, Delete, Put, Redirect } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from 'src/schemas/users.schemas';

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
    @Post()
    async CreateUser(@Body() formData: any) {
        const user = await this.usersService.createUser(formData);
        return user
    }
    @Put()
    async UpdateUser(@Body() formData: any) {
        const user = await this.usersService.updateUser(formData.id, formData.updateData);
        return user
    }
    @Delete(':id')
    async DeleteUser(@Param('id') id: string): Promise<void> {
        await this.usersService.deleteUser(id);
    }
}
