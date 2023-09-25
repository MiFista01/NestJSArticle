import { Injectable, NestMiddleware } from '@nestjs/common';
import {UsersService} from '../users/users.service'

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: any, res: any, next: () => void) {
    let hashedPassword = await this.usersService.hashPassword(req.body.password)
    req.body.password = hashedPassword
    next();
  }
}