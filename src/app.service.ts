import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Articles } from './schemas/articles.schemas';

@Injectable()
export class AppService {
  constructor(@InjectModel('Articles') private readonly articleModel: Model<Articles>) { }
  async findRandomArticles(count: number): Promise<Articles[]> {
    return await this.articleModel.aggregate([
        { $sample: { size: count } },
      ]).exec();
  }
}
