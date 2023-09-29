import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

import { articlesSchema } from './schemas/articles.schemas'; 
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { usersSchema } from './schemas/users.schemas';
import { CommentsModule } from './comments/comments.module';
import { commentsSchema } from './schemas/comments.schemas';
import { subscribeSchema } from './schemas/subscribe.schemas';
import { SubscribeModule } from './subscribe/subscribe.module';
import { subscribeTypeSchema } from './schemas/subscribe_type.schemas';
import { RegAuthCheckUserModule } from './reg_auth_check_user/reg_auth_check_user.module';
import { CheckAuthMiddleware } from './check-auth/check-auth.middleware';

dotenv.config()
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB,
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckAuthMiddleware).forRoutes('user/*');
    consumer.apply(CheckAuthMiddleware).forRoutes('article/*');
    consumer.apply(CheckAuthMiddleware).forRoutes('comment/*');
    consumer.apply(CheckAuthMiddleware).forRoutes('subscribe/*');
  }
}