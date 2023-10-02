import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validate } from 'class-validator';
import mongoose, { Model, Types } from 'mongoose';
import { CreateSubscribeDto } from 'src/DTO/subscribe.dto';
import { Subscribe } from 'src/schemas/subscribe.schemas';
import { SubscribeType } from 'src/schemas/subscribe_type.schemas';

@Injectable()
export class SubscribeService {
    constructor(
        @InjectModel('Subscribe') private readonly subscribeModel: Model<Subscribe>,
        @InjectModel('SubscribeType') private readonly subscribeTypeModel: Model<SubscribeType>,
    ) { }
    async createSubscribe(subData: {}): Promise<Subscribe> {
        const newSubscribe = new this.subscribeModel(subData);
        return await newSubscribe.save();
    }
    async createFreeSubscribe(userId: string): Promise<Subscribe | null | any> {
        const userSubscribe = await this.subscribeModel.aggregate([
            {$match:{user_id:new Types.ObjectId(userId)}}
        ])
        const typeFree = await this.subscribeTypeModel.findOne({price: 0}).exec();
        if(userSubscribe !== null){
            let start = new Date();
            let endMonth = new Date(start);
            endMonth.setDate(endMonth.getDate() + 1);
            let subscribeEnd = new Date(start);
            subscribeEnd.setDate(start.getDate()+typeFree.countDays)
            const subData = {
                "user_id": new Types.ObjectId(userId),
                "sub_id":typeFree._id,
                "start": start,
                "monthEnd": endMonth,
                "subscribeEnd": subscribeEnd,
                "countArticles": typeFree.countArticles
            }
            const errors = await validate(CreateSubscribeDto);
            if (errors.length > 0) {
                return { errors };
            }
            const subscribe = new this.subscribeModel(subData);
            return await subscribe.save();
        }else{
            return null
        }
    }
    async downgradeSubscribe(id: string): Promise<Subscribe> {
        const userSubscribe = await this.subscribeModel.findById(id).exec();
        const typeFree = await this.subscribeTypeModel.findOne({price: 0}).exec();
        if (!userSubscribe) {
          throw new Error("Subscribe not found");
        }
        userSubscribe.start = userSubscribe.subscribeEnd;
        const nextMonth = new Date(userSubscribe.subscribeEnd);
        nextMonth.setDate(nextMonth.getDate() + 10);
        const subscribeEnd = new Date(userSubscribe.subscribeEnd);
        subscribeEnd.setDate(subscribeEnd.getDate() + 10);
        userSubscribe.monthEnd = nextMonth;
        userSubscribe.subscribeEnd = subscribeEnd;
        userSubscribe.sub_id = typeFree._id;
        userSubscribe.countArticles = typeFree.countArticles;
        await userSubscribe.save();
      
        return userSubscribe;
    }      
    async findSubscribeById(id: string): Promise<Subscribe | null> {
        const subscribe = await this.subscribeModel.findById(id).populate('user_id').populate('sub_id').exec();
        
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
    async searchSubscribes(field:string[], key:string[], value:string[]): Promise<{subscribes:Subscribe[], count:number}> {
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
