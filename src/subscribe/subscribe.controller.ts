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
    @Post("search") // поиск подписок по полю и ели есть ключу
    async Search(@Body() formData: any) {
        const fields = formData.fields;
        const keys = formData.keys;
        const values = formData.values;
        const users = await this.subscribeService.searchSubscribes(fields, keys, values);
        return users
    }
    @Post()
    async CreateSubscribe(@Body() formData: any) {
        const userSubscribe = await this.subscribeService.searchSubscribes(["user_id"], [""], ["6514172589fd5111967abd05"]);
        const typeFree = await this.subscribeServiceType.findSubscribeType(formData.price)
        if(userSubscribe.count == 0){
            let start = new Date();
            let endMonth = new Date(start);
            endMonth.setDate(endMonth.getDate() + 30);
            let subscribeEnd = new Date(start);
            subscribeEnd.setDate(start.getDate()+typeFree.countArticles)
            const subData = {
                "user_id": new Types.ObjectId("6514172589fd5111967abd05"),
                "sub_id":new Types.ObjectId(typeFree._id.toString()),
                "start": start,
                "monthEnd": endMonth,
                "subscribeEnd": subscribeEnd,
                "countArticles": typeFree.countArticles
            }
            const subscribe = await this.subscribeService.createSubscribe(subData);
            return subscribe
        }else{
            return "А у вас подписка есть"
        }
    }
    @Put()
    async UpdateSubscribe(@Body() formData: any) {
        const userSubscribe = await this.subscribeService.searchSubscribes(["user_id"], [""], ["6514172589fd5111967abd05"]);
        const freeType = await this.subscribeServiceType.findSubscribeType(0)
        const type = await this.subscribeServiceType.findSubscribeType(formData.price)
        if(type._id.equals(freeType._id)){
            return "зачем вы выбрали бесплатный вариант?"
        }else if(!userSubscribe.subscribes[0].sub_id.equals(freeType._id)){
            return "а вы неможете поменять подпсику пока не истечёт старая"
        }else{
            let start = new Date();
            let endMonth = new Date(start);
            endMonth.setDate(endMonth.getDate() + 0);
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
