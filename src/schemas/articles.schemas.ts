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

export const articlesSchema = new Schema<Articles>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    UserLikes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    slug: { type: String, required: true },
    plot: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user' }
  },
  {
    timestamps: true,
    collection: 'stat',
    versionKey: false
  }
);

export default model<Articles>('stat', articlesSchema, 'stat');