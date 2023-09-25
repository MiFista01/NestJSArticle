import { Body, Controller, Get, Param, Post, Delete, Put, Redirect } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comments } from 'src/schemas/comments.schemas';

@Controller('comment')
export class CommentsController {
    constructor(private readonly usersService: CommentsService) {}

    @Get("/all") //получение всех коментов
    async Comments(): Promise<{ comments: Comments[] }> {
        const comments = await this.usersService.findAllComments();
        return { comments }; 
    }
    @Get("entity/:id") //получение коментов по айди
    async Comment(@Param("id") id:string): Promise<{ comment: Comments }| null> {
        const comment = await this.usersService.findCommentById(id);
        return { comment }; 
    }
    @Post("search") // поиск по полю автора или title у статьи
    async Search(@Body() formData: any) {
        const users = await this.usersService.searchComments(formData.field, formData.value);
        return users
    }
    @Post() // создание комента
    async CreateComment(@Body() formData: any) {
        const comment = await this.usersService.createComment(formData);
        return comment
    }
    @Put() // обновление комента
    async UpdateComment(@Body() formData: any) {
        const comment = await this.usersService.updateComment(formData.id, formData.updateData);
        return comment
    }
    @Delete(':id') // удаление комента
    async DeleteComment(@Param('id') id: string): Promise<void> {
        await this.usersService.deleteComment(id);
    }
}
