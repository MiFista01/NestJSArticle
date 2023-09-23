import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { articlesSchema } from 'src/schemas/articles.schemas';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import {PaginationMiddleware} from '../pagination/pagination.middleware'

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
      ArticlesModule,
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService],
})
export class ArticlesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('articles/pages/:page'); 
  }
}
