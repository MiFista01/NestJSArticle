import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { articlesSchema } from 'src/schemas/articles.schemas';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import {PaginationMiddleware} from '../pagination/pagination.middleware'
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
      ArticlesModule
    ],
    controllers: [ArticlesController],
    providers: [
      ArticlesService,
      {
        provide: APP_GUARD,
        useClass: AuthGuard, // Замените на класс вашего гварда
      }
    ],
})
export class ArticlesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('article/pages/:page');
  }
}
