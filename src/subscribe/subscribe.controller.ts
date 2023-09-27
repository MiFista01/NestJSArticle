import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { Subscribe } from 'src/schemas/subscribe.schemas';
import { SubscribeTypeService } from 'src/subscribeType/subscribeType.service';
import { Types } from 'mongoose';

@Controller('subscribe')
export class SubscribeController {
    constructor(
        private readonly subscribeService: SubscribeService,
        private readonly subscribeServiceType: SubscribeTypeService,
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
    @Post("search") // поиск подписок по имени юзера или по типу подписки
    async Search(@Body() formData: any) {
        const users = await this.subscribeService.searchSubscribes(formData.field, formData.value);
        return users
    }
    @Post()
    async CreateSubscribe(@Body() formData: any) {
        const type = await this.subscribeServiceType.findSubscribeType(formData.price)
        if (!type) {
            return { error: 'Тип подписки не найден' };
        }
        let start = new Date();
        let endMonth = new Date(start);
        endMonth.setDate(endMonth.getDate() + 30);
        let subscribeEnd = new Date(start);
        subscribeEnd.setDate(start.getDate()+type.countArticles)
        const subData = {
            "user_id": new Types.ObjectId("650829780b4ed81f770ad4dd"),
            "sub_id":new Types.ObjectId(type._id.toString()),
            "start": start,
            "monthEnd": endMonth,
            "subscribeEnd": subscribeEnd,
            "countArticles": type.countArticles
        }
        console.log(subData);
        const subscribe = await this.subscribeService.createSubscribe(subData);
        return subscribe
    }
    @Put()
    async UpdateSubscribe(@Body() formData: any) {
        const subscribe = await this.subscribeService.updateSubscribe(formData.id, formData.updateData);
        return subscribe
    }
    @Delete(':id')
    async DeleteComment(@Param('id') id: string): Promise<void> {
        await this.subscribeService.deleteSubscribe(id);
    }
}
