import { Timestamp } from 'mongodb';
import { Schema, Document, model, Types  } from 'mongoose';

export interface Articles extends Document {
  title:string;
  body:string;
  tags:string[];
  UserLikes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  plot: string;
  slug:string;
  author: Types.ObjectId;
}

const articlesSchema = new Schema<Articles>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }], // Изменим тип поля tagList на string[]
    UserLikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    slug: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export default model<Articles>('Movies', articlesSchema);