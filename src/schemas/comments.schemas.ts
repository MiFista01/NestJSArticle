import { Schema, Document, model, Types, SchemaTypes  } from 'mongoose';

export interface Comments extends Document {
  text: string;
  author: Types.ObjectId;
  article: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const commentsSchema = new Schema<Comments>(
  {
    text: { type: String, required: true },
    author: { type: SchemaTypes.ObjectId, required: true },
    article: { type: SchemaTypes.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'comments',
    versionKey: false,
  }
);

export default model<Comments>('comments', commentsSchema, 'comments');