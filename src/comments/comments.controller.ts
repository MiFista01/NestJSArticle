import { Body, Controller, Get, Param, Post, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comments } from 'src/schemas/comments.schemas';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCommentsDto, UpdateCommentsDto } from 'src/DTO/comments.dto';
import { validate } from 'class-validator';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { SearchDto } from 'src/DTO/search.dto';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}

@Controller('comment')
@ApiTags('comments')
@ApiHeader({name: 'token'})
@UseGuards(AuthGuard)
export class CommentsController {
    constructor(private readonly usersService: CommentsService) {}

    @Get("/all") //получение всех коментов
    @ApiOperation({ summary: 'Get all comments', description: "Return item list of comments" })
    async Comments(): Promise<{ comments: Comments[] }> {
        const comments = await this.usersService.findAllComments();
        return { comments }; 
    }
    @Get("entity/:id") //получение коментов по айди
    @ApiOperation({ summary: 'Get one comment', description: "Return comment" })
    async Comment(@Param("id") id:string): Promise<{ comment: Comments }| null> {
        const comment = await this.usersService.findCommentById(id);
        return { comment }; 
    }
    @Post("search") // поиск
    @ApiOperation({ summary: 'Search comment', description: "Return item list" })
    async Search(@Body() formData: SearchDto) {
        const fields = formData.fields;
        const keys = formData.keys;
        const values = formData.values;
        const users = await this.usersService.searchComments(fields, keys, values);
        return users
    }
    @Post("article/:id") // создание комента
    @ApiOperation({ summary: 'creating a comment using the article ID and text from the form ', description: "Return new comment" })
    async CreateComment(@Param("id") article:string, @Req() req:CustomRequest, @Body() formData: CreateCommentsDto) {
        const commentCreate = formData as Comments
        commentCreate.author = req.user.user
        commentCreate.article = new Types.ObjectId(article)
        const errors = await validate(CreateCommentsDto);
        if (errors.length > 0) {
            return { errors };
        }
        const comment = await this.usersService.createComment(commentCreate);
        return comment
    }
    @Put() // обновление комента
    @ApiOperation({ summary: 'updating a comment using the article ID and text from the form ', description: "Return updated comment" })
    async UpdateComment(@Param("id") id:string,@Body() formData: UpdateCommentsDto) {
        const comment = await this.usersService.updateComment(id, formData);
        return comment
    }
    @Delete(':id') // удаление комента
    async DeleteComment(@Param('id') id: string): Promise<void> {
        await this.usersService.deleteComment(id);
    }
}
