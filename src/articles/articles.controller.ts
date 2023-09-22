import { Body, Controller, Get, Param, Post, Delete, Put, Redirect } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Articles } from 'src/schemas/articles.schemas';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get("pages/:page")
    async Page(@Param("page") page:string): Promise<{ articles: Articles[] }> {
        try {
            const articles = await this.articlesService.findAllArticlesPages(Number(page));
            return { articles }; 
        } catch (error) {
            Redirect("articles/pages/1")
        }
    }
    @Get(":id")
    async Article(@Param("id") id:string): Promise<{ articles: Articles }| null> {
        const articles = await this.articlesService.findArticleById(id);
        return { articles }; 
    }
    @Post("search")
    async Search(@Body() formData: any) {
        const article = await this.articlesService.searchArticles(formData.search);
        return article
    }
    @Post()
    async CreateArticle(@Body() formData: any) {
        const article = await this.articlesService.createArticle(formData);
        return article
    }
    @Put()
    async UpdateArticle(@Body() formData: any) {
        const article = await this.articlesService.updateArticle(formData.id, formData.updateData);
        return article
    }
    @Delete(':id')
    async DeleteArticle(@Param('id') id: string): Promise<void> {
        await this.articlesService.deleteArticle(id);
    }
}
// {status: boolean, text:string}