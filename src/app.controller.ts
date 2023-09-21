import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Articles } from './schemas/articles.schemas';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @Render('pages/index')
  async Index(): Promise<{ articles: Articles[] }> {
    const articles = await this.appService.findRandomArticles(5);
    return { articles }; 
  }
}

