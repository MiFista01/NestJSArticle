import { Schema, Document, model} from 'mongoose';

export interface SubscribeType extends Document {
  countArticles:number;
  price:number;
  countDays:number;
}

export const subscribeTypeSchema = new Schema<SubscribeType>(
  {
    countArticles: { type: Number, required: true},
    price: { type: Number, required: true },
    countDays: { type: Number, required: true},
  },
  {
    timestamps: false,
    collection: 'subscribe_type',
    versionKey: false
  }
);

export default model<SubscribeType>('subscribe_type', subscribeTypeSchema, 'subscribe_type');