import { CanActivate, Catch, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SubscribeService } from '../subscribe/subscribe.service';

@Catch(UnauthorizedException)
@Injectable()
export class ArticleGuard implements CanActivate {
  constructor(private readonly subscribeService: SubscribeService) {}
  async canActivate(context: ExecutionContext,): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    let subscribe = await this.subscribeService.findSubscribeById(request.user.subscribe)
    const currentDate = new Date();
    if(currentDate > subscribe.subscribeEnd){
      let sub = await this.subscribeService.downgradeSubscribe(request.user.subscribe)
    }
    if(currentDate > subscribe.monthEnd){
      subscribe.countArticles = subscribe.sub_id["countArticles"]
      const nextMonth = new Date(subscribe.monthEnd)
      nextMonth.setDate(nextMonth.getDate() + 10)
      subscribe.monthEnd = nextMonth
      await subscribe.save()
    }
    if(subscribe.countArticles > 0){
      subscribe.countArticles -= 1 ;
      await subscribe.save();
      return true;
    }else{
      return false
    }
  }
}
