import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { subscribeSchema } from 'src/schemas/subscribe.schemas';
import { SubscribeTypeService } from 'src/subscribeType/subscribeType.service';
import { subscribeTypeSchema } from 'src/schemas/subscribe_type.schemas';
import { usersSchema } from 'src/schemas/users.schemas';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Subscribe', schema: subscribeSchema }]),
      MongooseModule.forFeature([{ name: 'SubscribeType', schema: subscribeTypeSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: usersSchema }]),
      SubscribeModule
    ],
    controllers: [SubscribeController],
    providers: [
      SubscribeService,
      SubscribeTypeService,
      {
        provide: APP_GUARD,
        useClass: AuthGuard, // Замените на класс вашего гварда
      }
    ],
})
export class SubscribeModule{
  configure(consumer: MiddlewareConsumer) {
  }
}