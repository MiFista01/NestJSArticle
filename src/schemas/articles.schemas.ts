import { Schema, Document, model, Types  } from 'mongoose';

export interface Articles extends Document {
  title:string;
  body:string;
  tags:string[];
  UserLikes: Types.ObjectId[];
  plot: string;
  slug:string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const articlesSchema = new Schema<Articles>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    UserLikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    slug: { type: String, required: true },
    plot: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'stat',
    versionKey: false
  }
);

export default model<Articles>('stat', articlesSchema, 'stat');