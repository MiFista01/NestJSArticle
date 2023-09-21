import { Body, Controller, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Articles } from 'src/schemas/articles.schemas';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get("pages/:page")
    async Page(@Param("page") page:string): Promise<{ articles: Articles[] }> {
        const articles = await this.articlesService.findAllArticles(page);
        return { articles }; 
    }
    @Get(":id")
    async Article(@Param("id") id:string): Promise<{ articles: Articles }| null> {
        const articles = await this.articlesService.findArticleById(id);
        return { articles }; 
    }
    @Post()
    async createArticle(@Body() formData: any) {
        const article = await this.articlesService.createArticle(formData);
        // return article
    }
    @Put()
    async updateArticle(@Body() formData: any) {
        const article = await this.articlesService.updateArticle(formData.id, formData.updateData);
        // return article
    }
    @Delete(':id')
    async deleteArticle(@Param('id') id: string): Promise<void> {
        await this.articlesService.deleteArticle(id);
    }
}
// {status: boolean, text:string}