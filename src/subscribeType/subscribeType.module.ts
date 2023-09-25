import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeTypeService } from './subscribeType.service';
import { subscribeTypeSchema } from 'src/schemas/subscribe_type.schemas';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'SubscribeType', schema: subscribeTypeSchema }]),
      SubscribeTypeModule,
    ],
    providers: [SubscribeTypeService],
})
export class SubscribeTypeModule{}