import { Body, Controller, Get, Param, Post, Delete, Put, Redirect, UseGuards, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Articles } from 'src/schemas/articles.schemas';
import { AuthGuard } from 'src/guards/auth.guard';
import { ArticleGuard } from 'src/guards/article.guard';
import { CreateArticleDto, UpdateArticleDto } from 'src/DTO/article.dto';
import { validate } from 'class-validator';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { SearchDto } from 'src/DTO/search.dto';
import { Users } from 'src/schemas/users.schemas';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}
@Controller('article')
@ApiTags('articles')
@ApiHeader({name: 'token'})
@UseGuards(AuthGuard)
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get("page/:page") // получеие статей на странице (пагинация)
    async Page(@Param("page") page:string): Promise<{ articles: Articles[] }> {
        try {
            const articles = await this.articlesService.findAllArticlesPages(Number(page));
            return { articles }; 
        } catch (error) {
            Redirect("articles/pages/1")
        }
    }
    @Get("entity/:id") // поулчение статьи по айди
    @UseGuards(ArticleGuard)
    async Article(@Param("id") id:string): Promise<{ articles: Articles }| null> {
        const articles = await this.articlesService.findArticleById(id);
        return { articles }; 
    }
    @Post("search") // поиск статей почти по всем полям
    async Search(@Body() formData: SearchDto) {
        const fields = formData.fields;
        const keys = formData.keys;
        const values = formData.values;
        const article = await this.articlesService.searchArticles(fields, keys, values);
        return article
    }

    @Post() // создание статей
    async CreateArticle(@Req() req: CustomRequest, @Body() formData: CreateArticleDto) {
        let createArticle = formData as Articles
        createArticle.author = req.user.user
        createArticle.slug = formData.title.toLowerCase().replace(/\s+/g, '-');
        const errors = await validate(CreateArticleDto);
        if (errors.length > 0) {
            return { errors };
        }
        const article = await this.articlesService.createArticle(createArticle);
        return article
    }
    @Put("/upd/:id") // обновление статей
    async UpdateArticle(@Param('id') id: string,@Req() req:CustomRequest, @Body() formData: UpdateArticleDto) {
        const errors = await validate(UpdateArticleDto);
        if (errors.length > 0) {
            return { errors };
        }
        const updateData = formData as Articles
        const article = await this.articlesService.findArticleById(id);
        const author = article.author[0]
        if(author._id.toString() == req.user.user){
            if(updateData.title != undefined){
                updateData.slug = formData.title.toLowerCase().replace(/\s+/g, '-');
            }
            return await this.articlesService.updateArticle(id, updateData)
        }else{
            return "this is not your article"
        }
    }
    @Put("/follo/:id") // обновление статей
    async UpdateArticleFollowers(@Param('id') id: string, @Req() req: CustomRequest, @Body() formData: any) {
        const article = await this.articlesService.searchArticles(["_id"], [""], [id]);
        if(article.count > 0){
            const userId = new Types.ObjectId(req.user.user);
            // Проверяем наличие пользователя в массиве UserLikes по author._id
            const userExistsInLikes = article.articles[0].UserLikes.some((userLike) => {
                return userLike._id.equals(userId);
            });
    
            if (userExistsInLikes) {
                // Пользователь найден в массиве UserLikes, удаляем его
                article.articles[0].UserLikes = article.articles[0].UserLikes.filter((userLike) => {
                return !userLike._id.equals(userId);
                });
            } else {
                // Пользователь не найден в массиве UserLikes, добавляем его
                article.articles[0].UserLikes.push(userId);
            }
    
            // Обновляем документ
            const updatedArticle = await this.articlesService.updateArticle(id, {UserLikes: article.articles[0].UserLikes,});
    
            return updatedArticle.UserLikes;
        }else{
            return "There is no article with this ID"
        }
    }
    @Delete(':id') // удаление статьи
    async DeleteArticle(@Param('id') id: string, @Req() req: CustomRequest): Promise<void | string> {
        const article = await this.articlesService.findArticleById(id);
        const author = article.author[0]
        if(author._id.toString() == req.user.user){
            return await this.articlesService.deleteArticle(id);
        }else{
            return "this is not your article"
        }
        
    }
}