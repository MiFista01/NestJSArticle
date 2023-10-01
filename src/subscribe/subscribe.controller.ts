import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { SubscribeService } from './subscribe.service';
import { Subscribe } from 'src/schemas/subscribe.schemas';
import { SubscribeTypeService } from 'src/subscribeType/subscribeType.service';
import { AuthGuard } from 'src/guards/auth.guard';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}

@Controller('subscribe')
@UseGuards(AuthGuard)
export class SubscribeController {
    constructor(
        private readonly subscribeService: SubscribeService,
        private readonly subscribeTypeService: SubscribeTypeService,
    ) {}

    @Get("/all") // получение всех подписок
    async Subscribes(): Promise<{ subscribes: Subscribe[] }> {
        const subscribes = await this.subscribeService.findAllSubscribes();
        return { subscribes }; 
    }
    @Get("entity/:id") // получение подписки по айди
    async Subscribe(@Param("id") id:string): Promise<{ subscribe: Subscribe }| null> {
        const subscribe = await this.subscribeService.findSubscribeById(id);
        return { subscribe }; 
    }
    @Post("search") // поиск подписок по полю и ели есть ключу
    async Search(@Body() formData: any) {
        const fields = formData.fields;
        const keys = formData.keys;
        const values = formData.values;
        const users = await this.subscribeService.searchSubscribes(fields, keys, values);
        return users
    }
    @Put()
    async UpdateSubscribe(@Req() req: CustomRequest, @Body() formData: any) {
        const userSubscribe = await this.subscribeService.searchSubscribes(["user_id"], [""], [req.user.user._id]);
        const freeType = await this.subscribeTypeService.findSubscribeType(0)
        const type = await this.subscribeTypeService.findSubscribeType(formData.price)
        if(type._id.equals(freeType._id)){
            return "Why should you choose the free option?"
        }else if(!userSubscribe.subscribes[0].sub_id.equals(freeType._id)){
            return "you cannot change your subscription until the old one expires"
        }else{
            let start = new Date();
            let endMonth = new Date(start);
            endMonth.setDate(endMonth.getDate() + 30);
            let subscribeEnd = new Date(start);
            subscribeEnd.setDate(subscribeEnd.getDate() + type.countDays);
            const updateData = {
                "sub_id":type._id,
                "start": start,
                "monthEnd": endMonth,
                "subscribeEnd": subscribeEnd,
                "countArticles": type.countArticles
            }
            const subscribe = await this.subscribeService.updateSubscribe(userSubscribe.subscribes[0]._id, updateData);
            return subscribe
        }
    }
    @Delete(':id')
    async DeleteComment(@Param('id') id: string): Promise<void> {
        await this.subscribeService.deleteSubscribe(id);
    }
}
