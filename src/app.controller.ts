import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Movies } from './schemas/articles.schemas';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @Render('pages/index')
  async Index(@Res() res: Response) {
    const movies = await this.appService.findRandomMovies(7);
    
    // Преобразуем объект в JSON с отступами
    const formattedJson = JSON.stringify(movies, null, 2);

    // Устанавливаем заголовки HTTP
    res.header('Content-Type', 'application/json');
    res.status(200).send(formattedJson);
  }
}

