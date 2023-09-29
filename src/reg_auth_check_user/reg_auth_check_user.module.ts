import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from 'src/schemas/users.schemas';
import { UsersModule } from 'src/users/users.module';
import { RegAuthCheckUserController } from './reg_auth_check_user.controller';
import { RegAuthCheckUserService } from './reg_auth_check_user.service';
import { UsersService } from 'src/users/users.service';
import { CheckAuthMiddleware } from 'src/check-auth/check-auth.middleware';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Users', schema: usersSchema }]),
        UsersModule,
        RegAuthCheckUserModule
      ],
      controllers: [RegAuthCheckUserController],
      providers: [RegAuthCheckUserService, UsersService],
})
export class RegAuthCheckUserModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        
    }
}
