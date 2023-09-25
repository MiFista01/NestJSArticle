import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscribeType } from 'src/schemas/subscribe_type.schemas';

@Injectable()
export class SubscribeTypeService {
    constructor(
        @InjectModel('SubscribeType') private readonly subscribeModel: Model<SubscribeType>,
    ) { }
    async createSubscribeType(subData: SubscribeType): Promise<SubscribeType> {
        const newSubscribeType = new this.subscribeModel(subData);
        return await newSubscribeType.save();
    }
    async findSubscribeTypeById(id: string): Promise<SubscribeType | null> {
        const subscribe = await this.subscribeModel.findById(id)
        return subscribe
    }
    async findSubscribeType(price: number): Promise<SubscribeType | null> {
        const subscribe = await this.subscribeModel.find({"price": price})
        return subscribe[0]
    }
    async findAllSubscribeTypes(): Promise<SubscribeType[]> {
        const subscribes = await this.subscribeModel.find().exec()
        return subscribes
    }
    async findCountSubscribeTypes(): Promise<number> {
        const count = await this.subscribeModel.countDocuments().exec()
        return count
    }
    async updateSubscribeType(id: string, updatedData: Partial<SubscribeType>,): Promise<SubscribeType | null> {
        return await this.subscribeModel
        .findByIdAndUpdate(id, updatedData, { new: true })
        .exec();
    }
    
    async deleteSubscribeType(id: string): Promise<void> {
        await this.subscribeModel.findByIdAndRemove(id).exec();
    }
}
