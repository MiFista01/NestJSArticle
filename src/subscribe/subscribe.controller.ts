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
        const users = await this.subscribeService.searchSubscribes(formData.field, formData.key, formData.value);
        return users
    }
    @Post()
    async CreateSubscribe(@Body() formData: any) {
        const userSubscribe = await this.subscribeService.searchSubscribes("user_id", "", "650829780b4ed81f770ad4dd");
        const typeFree = await this.subscribeServiceType.findSubscribeType(formData.price)
        console.log(userSubscribe)
        if(userSubscribe.count == 0){
            let start = new Date();
            let endMonth = new Date(start);
            endMonth.setDate(endMonth.getDate() + 30);
            let subscribeEnd = new Date(start);
            subscribeEnd.setDate(start.getDate()+typeFree.countArticles)
            const subData = {
                "user_id": new Types.ObjectId("650829780b4ed81f770ad4dd"),
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
        const userSubscribe = await this.subscribeService.searchSubscribes("user_id", "", "650829780b4ed81f770ad4dd");
        const freeType = await this.subscribeServiceType.findSubscribeType(0)
        const type = await this.subscribeServiceType.findSubscribeType(formData.price)
        if(type._id == freeType._id){
            return "зачем вы выбрали бесплатный вариант?"
        }else if(userSubscribe.subscribes[0]._id != freeType._id){
            return "а вы неможете поменять подпсику пока не истечёт старая подписка"
        }else{
            let start = new Date();
            let endMonth = new Date(start);
            endMonth.setDate(endMonth.getDate() + 30);
            let subscribeEnd = new Date(start);
            const updateData = {
                "start": start,
                "monthEnd": endMonth,
                "subscribeEnd": subscribeEnd,
                "countArticles": type.countArticles
            }
            const subscribe = await this.subscribeService.updateSubscribe(formData.id, updateData);
            return subscribe
        }
    }
    @Delete(':id')
    async DeleteComment(@Param('id') id: string): Promise<void> {
        await this.subscribeService.deleteSubscribe(id);
    }
}
