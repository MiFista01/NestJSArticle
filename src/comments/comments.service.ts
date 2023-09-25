import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comments } from 'src/schemas/comments.schemas';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel('Comments') private readonly commentModel: Model<Comments>,
    ) { }

  async createComment(userData: Comments): Promise<Comments> {
    const newComment = new this.commentModel(userData);
    return await newComment.save();
  }

  async findCommentById(id: string): Promise<Comments | null> {
    const comment = await this.commentModel.aggregate([
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
          from: 'stat',
          localField: 'article',
          foreignField: '_id',
          as: 'article'
        }
      }
  ]).exec()
    return comment[0]
  }

  async findAllComments(): Promise<Comments[]> {
    const Comments = await this.commentModel.aggregate([
      {$lookup: {
        from: 'user', 
        localField: 'author', 
        foreignField: '_id', 
        as: 'author'
      }},
      {$lookup: {
        from: 'stat', 
        localField: 'article', 
        foreignField: '_id', 
        as: 'article'
      }}
    ]).exec()
    return Comments
  }

  async searchComments(field: string, value:string): Promise<{comments:Comments[], count:number}> {
    const matchQuery = {};
    let searchField:string
    if (field === "author"){
      searchField = field+".name"
    }
    else if (field === "article"){
      searchField = field+".title"
    }
    matchQuery[searchField] = { $regex: new RegExp(value, 'i') };
    const comments = await this.commentModel.aggregate([
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
        $lookup:
            { 
              from: 'stat',
              localField: 'article',
              foreignField: '_id',
              as: 'article' 
            }
      },
      {
        $match: matchQuery
      }
    ]).exec();
    const count = comments.length;
    return {comments, count};
  }
  async updateComment(id: string, updatedData: Partial<Comments>,): Promise<Comments | null> {
    return await this.commentModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();
  }

  async deleteComment(id: string): Promise<void> {
    await this.commentModel.findByIdAndRemove(id).exec();
  }
}
