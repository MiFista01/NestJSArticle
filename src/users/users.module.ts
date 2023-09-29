import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from '../schemas/users.schemas';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashPasswordMiddleware } from 'src/hash-password/hash-password.middleware';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Users', schema: usersSchema }]),
      UsersModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(HashPasswordMiddleware).forRoutes({ path: 'user/*', method: RequestMethod.POST });
      consumer.apply(HashPasswordMiddleware).forRoutes({ path: 'user/', method: RequestMethod.PUT }); 
    }
  }