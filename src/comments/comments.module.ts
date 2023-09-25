import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { commentsSchema } from 'src/schemas/comments.schemas';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Comments', schema: commentsSchema }]),
      CommentsModule,
    ],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule{
    // configure(consumer: MiddlewareConsumer) {
    //   consumer.apply(HashPasswordMiddleware).forRoutes({ path: 'users/', method: RequestMethod.POST }); 
    // }
}
//implements NestModule