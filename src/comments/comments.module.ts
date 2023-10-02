import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { commentsSchema } from 'src/schemas/comments.schemas';
import { UsersModule } from 'src/users/users.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { articlesSchema } from 'src/schemas/articles.schemas';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Comments', schema: commentsSchema }]),
      MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
      CommentsModule,
      UsersModule,
      ArticlesModule
    ],
    controllers: [CommentsController],
    providers: [
      CommentsService,
    ],
})
export class CommentsModule{}