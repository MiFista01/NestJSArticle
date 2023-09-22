import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Articles } from '../schemas/articles.schemas';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel('Articles') private readonly articleModel: Model<Articles>,
    ) { }

  async createArticle(articleData: Articles): Promise<Articles> {
    const newArticle = new this.articleModel(articleData);
    return await newArticle.save();
  }

  async findArticleById(id: string): Promise<Articles | null> {
    const article = await this.articleModel.aggregate([
        { $match: {"_id": new mongoose.Types.ObjectId(id)} },
        {$lookup:
            { 
                from: 'user',
                localField: 'author',
                foreignField: '_id',
                as: 'author' }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'UserLikes',
            foreignField: '_id',
            as: 'UserLikes'
          }
        }
    ]).exec()
    return article[0]
  }

  async findAllArticlesPages(page:number): Promise<Articles[]> {
    const limit = 5
    const skip = (page - 1)*limit
    const articles = await this.articleModel.aggregate([
        { $skip: skip },
        { $limit: limit },
        {$lookup:
            { 
                from: 'user',
                localField: 'author',
                foreignField: '_id',
                as: 'author' }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'UserLikes',
            foreignField: '_id',
            as: 'UserLikes'
          }
        }
      ]).exec()
      return articles
  }
  async findCountArticles(): Promise<number> {
    const count = await this.articleModel.countDocuments().exec()
    return count
  }
  async searchArticles(search: string): Promise<Articles[]> {
    const articles = await this.articleModel.aggregate([
      {
        $lookup: {
            from: 'user',
            localField: 'author',
            foreignField: '_id',
            as: 'author'
        }
      },
        {
            $match: {
                $or: [
                    { title: { $regex: new RegExp(search, 'i') } },
                    { tags: { $in: [new RegExp(search, 'i')] } },
                    { plot: { $regex: new RegExp(search, 'i') } },
                    { slug: { $regex: new RegExp(search, 'i') } },
                    { "author.name": { $regex: new RegExp(search, 'i') } }
                ]
            }
        },
        {
            $lookup: {
                from: 'user',
                localField: 'UserLikes',
                foreignField: '_id',
                as: 'UserLikes'
            }
        }
    ]).exec();

    return articles;
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
