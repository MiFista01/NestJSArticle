import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Articles, articlesSchema } from './schemas/articles.schemas'; 

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://MiFista01:Al2ek0s01@aaa.hhorz37.mongodb.net/sample_mflix',
    ),
    MongooseModule.forFeature([{ name: 'Articles', schema: articlesSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}