import { Body, Controller, Get, Param, Post, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { Users } from 'src/schemas/users.schemas';
import { AuthGuard } from 'src/guards/auth.guard';
import { SearchUserDto, UpdateUserDto } from 'src/DTO/user.dto';
import { validate } from 'class-validator';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}

@ApiBearerAuth()
@Controller('api/user')
@ApiTags('user')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}
    @Get("/all")
    @ApiOperation({ summary: 'Get users items list', description: "Return users item list" })
    async Users(): Promise<{ users: Users[] }> {
        const users = await this.usersService.findAllUsers();
        return { users }; 
    }
    @Get("entity/:id")
    @ApiOperation({ summary: 'Get entity of users', description: "Return one user item" })
    async User(@Param("id") id:string): Promise<{ user: Users }| null> {
        const user = await this.usersService.findUserById(id);
        return { user }; 
    }
    @Post("search")
    @ApiOperation({ summary: 'Search and get a list of items', description: "Return users item list" })
    async Search(@Body() formData: SearchUserDto) {
        const searchParams = {};
        if (formData.name !== undefined) {
            searchParams['name'] = { value: formData.name, ec: true };
        }

        if (formData.email !== undefined) {
            searchParams['email'] = { value: formData.email, ec: true };
        }

        if (formData.bio !== undefined) {
            searchParams['bio'] = { value: formData.bio, ec: true };
        }
        const users = await this.usersService.searchUsers(searchParams);
        return users
    }
    @Get("/profile")
    @ApiOperation({ summary: 'Get profile', description: "Return profile" })
    async Profile(@Req() req:CustomRequest): Promise<Users > {
        const user = await this.usersService.findUserById(req.user.user);
        return user; 
    }
    @Put("/profile")
    @ApiOperation({ summary: 'Update profile', description: "Return updated profile" })
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
                    await this.usersService.updateUser(req.user.user, {name:formData.name});
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
                    await this.usersService.updateUser(req.user.user, {email:formData.email});
                    delete formData.email
                }
            }
            const user = await this.usersService.updateUser(req.user.user, formData);
            return user
        } catch (error) {
            return "data not valid"
        }
    }
    @Get("/profile/out")
    @ApiOperation({ summary: 'Logout' })
    async Out(@Req() req: Request): Promise<string> {
        if (req.headers['token']) {
            delete req.headers['token'];
        }
        return "logout"; 
    }
    @Delete("/profile")
    @ApiOperation({ summary: 'Delete user from profile', description: "return string 'user deleted'" })
    async Delete(@Req() req: CustomRequest): Promise<string> {
        const user = await this.usersService.deleteUser(req.user.user);
        return "user deleted"; 
    }
}
