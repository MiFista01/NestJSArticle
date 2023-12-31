import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { SubscribeService } from './subscribe.service';
import { Subscribe } from 'src/schemas/subscribe.schemas';
import { SubscribeTypeService } from 'src/subscribeType/subscribeType.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateSubscribeDto } from 'src/DTO/subscribe.dto';
import { validate } from 'class-validator';
import { ApiBearerAuth, ApiHeader, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchDto } from 'src/DTO/search.dto';

interface CustomRequest extends Request {
    user?: any;
    valid?: boolean;
}

@ApiBearerAuth()
@Controller('api/subscribe')
@ApiTags('subscribe')
@UseGuards(AuthGuard)
export class SubscribeController {
    constructor(
        private readonly subscribeService: SubscribeService,
        private readonly subscribeTypeService: SubscribeTypeService,
    ) {}

    @Get("/all") // получение всех подписок
    @ApiOperation({ summary: 'Get all item list of subscribes', description: "Return subscribes item list" })
    async Subscribes(): Promise<{ subscribes: Subscribe[] }> {
        const subscribes = await this.subscribeService.findAllSubscribes();
        return { subscribes }; 
    }
    @Get("entity/:id") // получение подписки по айди
    @ApiOperation({ summary: 'Get one item of subscribe', description: "Return subscribe item" })
    async Subscribe(@Param("id") id:string): Promise<{ subscribe: Subscribe }| null> {
        const subscribe = await this.subscribeService.findSubscribeById(id);
        return { subscribe }; 
    }
    @Post("search") // поиск подписок по полю и ели есть ключу
    @ApiOperation({ summary: 'Search and get a list of items', description: "Return users item list" })
    async Search(@Body() formData: SearchDto) {
        const fields = formData.fields;
        const keys = formData.keys;
        const values = formData.values;
        const users = await this.subscribeService.searchSubscribes(fields, keys, values);
        return users
    }
    @Put()
    @ApiOperation({ summary: 'Subscription type update', description: "Return updated subscribe" })
    async UpdateSubscribe(@Req() req: CustomRequest, @Body() formData: UpdateSubscribeDto) {
        const userSubscribe = await this.subscribeService.searchSubscribes(["user_id"], [""], [req.user.user]);
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
            const errors = await validate(UpdateSubscribeDto);
            if (errors.length > 0) {
                return { errors };
            }
            const subscribe = await this.subscribeService.updateSubscribe(userSubscribe.subscribes[0]._id, updateData);
            return subscribe
        }
    }
    // @Delete(':id')
    // @ApiOperation({ summary: 'Dekete sibscribe item' })
    // async DeleteComment(@Param('id') id: string): Promise<void> {
    //     await this.subscribeService.deleteSubscribe(id);
    // }
}
