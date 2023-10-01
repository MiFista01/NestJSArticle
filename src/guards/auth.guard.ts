import { CanActivate, Catch, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Catch(UnauthorizedException)
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: UsersService) {}
  async canActivate(context: ExecutionContext,): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    try {
      const user = await this.authService.checkJWT(request.headers.token)
      if(user == null){
        response.redirect(303,'/error_auth')
        return false
      }
      request.user = user;
      return true
    } catch (error) {
      response.redirect(303,'/error_auth')
      return false
    }
  }
}
