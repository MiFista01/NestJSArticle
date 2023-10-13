import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { articlesSchema } from 'src/schemas/articles.schemas';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import {PaginationMiddleware} from '../pagination/pagination.middleware'
import { UsersModule } from 'src/users/users.module';
import { SubscribeModule } from 'src/subscribe/subscribe.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
      ArticlesModule,
      UsersModule,
      SubscribeModule
    ],
    controllers: [ArticlesController],
    providers: [
      ArticlesService,
    ],
    exports:[ArticlesService]
})
export class ArticlesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('api/article/page/:page');
  }
}
