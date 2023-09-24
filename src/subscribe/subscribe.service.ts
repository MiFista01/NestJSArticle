import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscribe } from 'src/schemas/subscribe.schemas';

@Injectable()
export class SubscribeService {
    constructor(
        @InjectModel('Subscribe') private readonly subscribeModel: Model<Subscribe>,
    ) { }
    async createSubscribe(userData: Subscribe): Promise<Subscribe> {
        const newSubscribe = new this.subscribeModel(userData);
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
    async searchSubscribes(search: string): Promise<Subscribe[]> {
        const subscribes = await this.subscribeModel.aggregate([
            {
                $lookup:{
                    from: 'user',
                    localField: 'id_user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    $or: [
                        { "user.name": { $regex: new RegExp(search, 'i') } },
                        { "user.email": { $regex: new RegExp(search, 'i') } },
                    ]
                }
            }
        ]).exec();
        return subscribes;
    }
    async searchSubscribesFromTypes(search: number): Promise<Subscribe[]> {
        const subscribesMod:Subscribe[] = await this.subscribeModel.aggregate([
            {
                $lookup:{
                    from: 'user',
                    localField: 'id_user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    type:search
                }
            },
            {
                $count: 'subscribesCount'
            }
        ]);
        const [subscribes, [{ subscribesCount }]] = await Promise.all([
            subscribesMod.exec(),
            subscribesMod
        ]);
        return subscribes;
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
