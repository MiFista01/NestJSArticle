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
    const newArticle = (await new this.articleModel(articleData));
    return await newArticle.save();
  }

  async findArticleById(id: string): Promise<Articles | null> {
    const article = await this.articleModel.aggregate([
        { $match: {"_id": new mongoose.Types.ObjectId(id)} },
        {
          $lookup:
            { 
              from: 'user',
              localField: 'author',
              foreignField: '_id',
              as: 'author' 
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
  async searchArticles(field: string[], key:string[], value:string[]): Promise<{articles:Articles[], count:number}> {
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
    const articles = await this.articleModel.aggregate([
      {
        $lookup: {
            from: 'user',
            localField: 'author',
            foreignField: '_id',
            as: 'user'
        }
      },
      {
        $lookup: {
          from: 'user',
          localField: 'UserLikes',
          foreignField: '_id',
          as: 'UserLikes'
        }
      },
      {
          $match: {
              $or: queryMatchArray
          }
      }
    ]).exec();
    let count = articles.length
    return {articles, count};
  }

  async updateArticle(id: string, updatedData: Partial<Articles>,): Promise<Articles | null> {
    return await this.articleModel
      .findByIdAndUpdate(id, updatedData, { new: true }).populate({path:"author", select:"-password"})
      .exec();
  }

  async deleteArticle(id: string): Promise<void> {
    await this.articleModel.findByIdAndRemove(id).exec();
  }
}
