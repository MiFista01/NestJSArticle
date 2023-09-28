import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Subscribe } from 'src/schemas/subscribe.schemas';

@Injectable()
export class SubscribeService {
    constructor(
        @InjectModel('Subscribe') private readonly subscribeModel: Model<Subscribe>,
    ) { }
    async createSubscribe(subData: {}): Promise<Subscribe> {
        const newSubscribe = new this.subscribeModel(subData);
        return await newSubscribe.save();
    }
    
    async findSubscribeById(id: string): Promise<Subscribe | null> {
        const subscribe = await this.subscribeModel.findById(id).populate('user_id').populate('sub_id');
        return subscribe
    }
    async findAllSubscribes(): Promise<Subscribe[]> {
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
                $project:{user_id:0, sub_id:0}
            }
        ]).exec();
        return subscribes
    }
    async findCountSubscribes(): Promise<number> {
        const count = await this.subscribeModel.countDocuments().exec()
        return count
    }
    async searchSubscribes(field:[string], key:[string], value:[string]): Promise<{subscribes:Subscribe[], count:number}> {
        const queryMatchArray = []
        let queryMatch = {}
        if(field.length == key.length && value.length) {
            for (let index = 0; index < field.length; index++) {
                if (key[index] != ""){
                    if(key[index].includes("_id")){
                        queryMatch[field[index]+"."+key[index]] = new mongoose.Types.ObjectId(value[index])
                    }else{
                        queryMatch[field[index]+"."+key[index]] = new RegExp(value[index], "i")
                    }
                    }else{
                    if(field[index].includes("_id")){
                        queryMatch[field[index]] = new mongoose.Types.ObjectId(value[index])
                    }else{
                        queryMatch[field[index]] = new RegExp(value[index], "i")
                    }
                    }
                queryMatchArray.push(queryMatch)
                queryMatch = {}
            }
        }
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
                $match: {
                    $or: queryMatchArray
                }
            },
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
