import { Schema, Document, model, Types, SchemaTypes  } from 'mongoose';

export interface Comments extends Document {
  text: string;
  createdAt: Date;
  updatedAt: Date;
  author: Types.ObjectId;
  article: Types.ObjectId;
}

export const commentsSchema = new Schema<Comments>(
  {
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    author: { type: SchemaTypes.ObjectId, required: true },
    article: { type: SchemaTypes.ObjectId, required: true },
  },
  {
    timestamps: true,
    collection: 'comments',
    versionKey: false,
  }
);

export default model<Comments>('comments', commentsSchema, 'comments');