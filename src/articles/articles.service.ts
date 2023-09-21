import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Articles } from '../schemas/articles.schemas';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel('Articles') private readonly articleModel: Model<Articles>) { }

  async createArticle(articleData: Articles): Promise<Articles> {
    const newArticle = new this.articleModel(articleData);
    return await newArticle.save();
  }

  async findArticleById(id: string): Promise<Articles | null> {
    return await this.articleModel.findById(id).exec();
  }

  async findAllArticles(page): Promise<Articles[]> {
    const limit = 5
    const skip = (page - 1)*limit
    const articles = await this.articleModel.aggregate([
        { $skip: skip },
        { $limit: limit },
      ]).exec()
      return articles
  }
  async findCountArticles(): Promise<number> {
    const count = await this.articleModel.countDocuments().exec()
    return count
  }
  async updateArticle(id: string, updatedData: Partial<Articles>,): Promise<Articles | null> {
    return await this.articleModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();
  }

  async deleteArticle(id: string): Promise<void> {
    await this.articleModel.findByIdAndRemove(id).exec();
  }
}
