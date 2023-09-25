import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { subscribeSchema } from 'src/schemas/subscribe.schemas';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Subscribe', schema: subscribeSchema }]),
      SubscribeModule,
    ],
    controllers: [SubscribeController],
    providers: [SubscribeService],
})
export class SubscribeModule{
    // configure(consumer: MiddlewareConsumer) {
    //   consumer.apply(HashPasswordMiddleware).forRoutes({ path: 'users/', method: RequestMethod.POST }); 
    // }
}