import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { articlesSchema } from './schemas/articles.schemas'; 
import { ArticlesService } from './articles/articles.service';
import { ArticlesController } from './articles/articles.controller';
import { ArticlesModule } from './articles/articles.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:Password@dbcluster.yamub90.mongodb.net/db_stat',
    ),
    MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
    ArticlesModule,
  ],
  controllers: [AppController, ArticlesController],
  providers: [AppService, ArticlesService],
})
export class AppModule {}