import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Articles } from './schemas/articles.schemas';
import { ApiOperation } from '@nestjs/swagger';

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @Render('pages/index')
  @ApiOperation({ summary: 'Random 7 articles', description: "" })
  async Index(): Promise<{ articles: Articles[] }> {
    const articles = await this.appService.findRandomArticles(5);
    return { articles }; 
  }
  @Get("error_auth")
  @ApiOperation({ summary: 'Redirect on this page if user no autharization', description: "" })
  async ErrorAuth(): Promise<string> {
    return "oh oh oh, YOU ARE NOT AUTHORIZED!"; 
  }
}

