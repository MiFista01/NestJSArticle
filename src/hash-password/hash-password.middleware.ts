import { Injectable, NestMiddleware } from '@nestjs/common';
import { validate } from 'class-validator';
import { UpdateUserDto } from 'src/DTO/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: any, res: any, next: () => void) {
    let hashedPassword
    if(req.body.password !== undefined){
      if(typeof req.body.password == 'string'){
        hashedPassword = await this.usersService.hashPassword(req.body.password)
        req.body.password = hashedPassword
        req.valid = true
      }else{
        req.valid = false
      }
    }
    next();
  }
}
