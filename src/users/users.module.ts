import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from '../schemas/users.schemas';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashPasswordMiddleware } from 'src/hash-password/hash-password.middleware';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { subscribeSchema } from '../schemas/subscribe.schemas';
import { subscribeTypeSchema } from 'src/schemas/subscribe_type.schemas';
import { RegAuthController } from './RegAuth.controller';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Users', schema: usersSchema }]),
      MongooseModule.forFeature([{ name: 'Subscribe', schema: subscribeSchema }]),
      MongooseModule.forFeature([{ name: 'SubscribeType', schema: subscribeTypeSchema }]),
      UsersModule,
    ],
    controllers: [
      UsersController,
      RegAuthController
    ],
    providers: [
      UsersService,
      SubscribeService
    ],
    exports:[UsersService]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes({ path: '/reg', method: RequestMethod.POST });
    consumer.apply(HashPasswordMiddleware).forRoutes({ path: '/user', method: RequestMethod.PUT });
  }
}