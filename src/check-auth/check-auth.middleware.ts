import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'crypto';
import * as jwt from 'jsonwebtoken'
import * as  dotenv from 'dotenv'
dotenv.config()
@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(jwt.verify(req.headers.token, process.env.SECRET_KEY))
    next();
  }
}
