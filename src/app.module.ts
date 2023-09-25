import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { articlesSchema } from './schemas/articles.schemas'; 
import { ArticlesService } from './articles/articles.service';
import { ArticlesController } from './articles/articles.controller';
import { ArticlesModule } from './articles/articles.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { usersSchema } from './schemas/users.schemas';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { commentsSchema } from './schemas/comments.schemas';
import { subscribeSchema } from './schemas/subscribe.schemas';
import { SubscribeModule } from './subscribe/subscribe.module';
import { SubscribeController } from './subscribe/subscribe.controller';
import { SubscribeService } from './subscribe/subscribe.service';
import { subscribeTypeSchema } from './schemas/subscribe_type.schemas';
import { SubscribeTypeService } from './subscribeType/subscribeType.service';
import { SubscribeTypeModule } from './subscribeType/subscribeType.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:Password@dbcluster.yamub90.mongodb.net/db_stat',
    ),
    MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
    MongooseModule.forFeature([{ name: 'Users', schema: usersSchema }]),
    MongooseModule.forFeature([{ name: 'Comments', schema: commentsSchema }]),
    MongooseModule.forFeature([{ name: 'Subscribe', schema: subscribeSchema }]),
    MongooseModule.forFeature([{ name: 'SubscribeType', schema: subscribeTypeSchema }]),
    ArticlesModule,
    UsersModule,
    CommentsModule,
    SubscribeModule
  ],
  controllers: [AppController, ArticlesController, UsersController, CommentsController, SubscribeController],
  providers: [AppService, ArticlesService, UsersService, CommentsService, SubscribeService, SubscribeTypeService],
})
export class AppModule {}