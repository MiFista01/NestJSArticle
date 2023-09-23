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
import { SubscribeService } from './subscribe/subscribe.service';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:Password@dbcluster.yamub90.mongodb.net/db_stat',
    ),
    MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
    MongooseModule.forFeature([{ name: 'Users', schema: usersSchema }]),
    ArticlesModule,
    UsersModule,
  ],
  controllers: [AppController, ArticlesController, UsersController],
  providers: [AppService, ArticlesService, UsersService, SubscribeService],
})
export class AppModule {}