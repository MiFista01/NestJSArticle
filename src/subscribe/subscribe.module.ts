import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { subscribeSchema } from 'src/schemas/subscribe.schemas';
import { SubscribeTypeService } from 'src/subscribeType/subscribeType.service';
import { subscribeTypeSchema } from 'src/schemas/subscribe_type.schemas';
import { usersSchema } from 'src/schemas/users.schemas';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Subscribe', schema: subscribeSchema }]),
      MongooseModule.forFeature([{ name: 'SubscribeType', schema: subscribeTypeSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: usersSchema }]),
      SubscribeModule,
      UsersModule
    ],
    controllers: [SubscribeController],
    providers: [
      SubscribeService,
      SubscribeTypeService,
    ],
    exports:[SubscribeService]
})
export class SubscribeModule{}