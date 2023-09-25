import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { Subscribe } from 'src/schemas/subscribe.schemas';

@Controller('subscribe')
export class SubscribeController {
    constructor(private readonly subscribeService: SubscribeService,) {}

    @Get("/all") // получение всех подписок
    async Subscribes(): Promise<{ subscribes: Subscribe[] }> {
        const subscribes = await this.subscribeService.findAllSubscribes();
        return { subscribes }; 
    }
    @Get("entity/:id") // получение подписки по айди
    async Subscribe(@Param("id") id:string): Promise<{ comment: Subscribe }| null> {
        const comment = await this.subscribeService.findSubscribeById(id);
        return { comment }; 
    }
    @Post("search") // поиск подписок по имени юзера или по типу подписки
    async Search(@Body() formData: any) {
        const users = await this.subscribeService.searchSubscribes(formData.field, formData.value);
        return users
    }
    @Post()
    async CreateSubscribe(@Body() formData: any) {
        // const comment = await this.subscribeService.createSubscribe(formData);
        // return comment
    }
    @Put()
    async UpdateSubscribe(@Body() formData: any) {
        const comment = await this.subscribeService.updateSubscribe(formData.id, formData.updateData);
        return comment
    }
    @Delete(':id')
    async DeleteComment(@Param('id') id: string): Promise<void> {
        await this.subscribeService.deleteSubscribe(id);
    }
}
