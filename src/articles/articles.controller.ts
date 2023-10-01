import { Body, Controller, Get, Param, Post, Delete, Put, Redirect, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Articles } from 'src/schemas/articles.schemas';
import { AuthGuard } from 'src/guards/auth.guard';
import { ArticleGuard } from 'src/guards/article.guard';

@Controller('article')
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
    async Search(@Body() formData: any) {
        const fields = formData.fields;
        const keys = formData.keys;
        const values = formData.values;
        const article = await this.articlesService.searchArticles(fields, keys, values);
        return article
    }
    @Post() // создание статей
    async CreateArticle(@Body() formData: any) {
        const article = await this.articlesService.createArticle(formData);
        return article
    }
    @Put() // обновление статей
    async UpdateArticle(@Body() formData: any) {
        const article = await this.articlesService.updateArticle(formData.id, formData.updateData);
        return article
    }
    @Delete(':id') // удаление статьи
    async DeleteArticle(@Param('id') id: string): Promise<void> {
        await this.articlesService.deleteArticle(id);
    }
}