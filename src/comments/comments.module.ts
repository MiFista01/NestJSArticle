import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { commentsSchema } from 'src/schemas/comments.schemas';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Comments', schema: commentsSchema }]),
      CommentsModule,
      UsersModule
    ],
    controllers: [CommentsController],
    providers: [
      CommentsService,
    ],
})
export class CommentsModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
    }
}
//implements NestModule