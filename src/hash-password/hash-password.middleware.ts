import { Injectable, NestMiddleware } from '@nestjs/common';
import {UsersService} from '../users/users.service'

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: any, res: any, next: () => void) {
    let hashedPassword
    if(req.body.password === undefined && req.body.updateData.password !== undefined) {
      console.log(req.body.updateData)
      hashedPassword = await this.usersService.hashPassword(req.body.updateData.password)
      req.body.updateData.password = hashedPassword
    }else if(req.body.password !== undefined && req.body.updateData.password === undefined){
      hashedPassword = await this.usersService.hashPassword(req.body.password)
      req.body.password = hashedPassword
    }
    next();
  }
}
