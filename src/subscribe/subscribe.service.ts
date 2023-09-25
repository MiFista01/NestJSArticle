import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscribe } from 'src/schemas/subscribe.schemas';

@Injectable()
export class SubscribeService {
    constructor(
        @InjectModel('Subscribe') private readonly subscribeModel: Model<Subscribe>,
    ) { }
    async createSubscribe(subData: Subscribe): Promise<Subscribe> {
        const newSubscribe = new this.subscribeModel(subData);
        return await newSubscribe.save();
    }
    
    async findSubscribeById(id: string): Promise<Subscribe | null> {
        const subscribe = await this.subscribeModel.findById(id)
        return subscribe
    }
    async findAllSubscribes(): Promise<Subscribe[]> {
        const subscribes = await this.subscribeModel.find().exec()
        return subscribes
    }
    async findCountSubscribes(): Promise<number> {
        const count = await this.subscribeModel.countDocuments().exec()
        return count
    }
    async searchSubscribes(field:string, value:string): Promise<{subscribes:Subscribe[], count:number}> {
        const queryMatch = {}
        let searchField:string
        if(field == "user"){
            searchField = field+".name"
        }else if(field == "sub"){
            searchField = field+".price"
        }
        queryMatch[searchField] = new RegExp(value, "i")
        const subscribes = await this.subscribeModel.aggregate([
            {
                $lookup:{
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup:{
                    from: 'subscribe_type',
                    localField: 'sub_id',
                    foreignField: '_id',
                    as: 'subscribe'
                }
            },
            {
                $match: queryMatch
            },
            {
                $project:{user_id:0, sub_id:0}
            }
        ]).exec();
        const count = subscribes.length
        return {subscribes, count};
    }
    async updateSubscribe(id: string, updatedData: Partial<Subscribe>,): Promise<Subscribe | null> {
        return await this.subscribeModel
        .findByIdAndUpdate(id, updatedData, { new: true })
        .exec();
    }
    
    async deleteSubscribe(id: string): Promise<void> {
        await this.subscribeModel.findByIdAndRemove(id).exec();
    }
}
