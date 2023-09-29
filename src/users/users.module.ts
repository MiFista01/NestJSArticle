import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from '../schemas/users.schemas';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';
import { HashPasswordMiddleware } from 'src/hash-password/hash-password.middleware';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Users', schema: usersSchema }]),
      UsersModule,
    ],
    controllers: [UsersController],
    providers: [
      UsersService,
      {
        provide: APP_GUARD,
        useClass: AuthGuard, // Замените на класс вашего гварда
      }
    ],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(HashPasswordMiddleware).forRoutes({ path: '/reg', method: RequestMethod.POST });
      consumer.apply(HashPasswordMiddleware).forRoutes({ path: '/upd', method: RequestMethod.PUT });
    }
  }