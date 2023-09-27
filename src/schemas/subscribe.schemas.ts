import { Schema, Document, model, Types } from 'mongoose';

export interface Subscribe extends Document {
  user_id: Types.ObjectId;
  sub_id: Types.ObjectId;
  start: Date;
  monthEnd: Date;
  subscribeEnd: Date;
  countArticles: number;
}

export const subscribeSchema = new Schema<Subscribe>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    sub_id: { type: Schema.Types.ObjectId, required: true, ref: 'SubscribeType' },
    start: { type: Date, required: true },
    monthEnd: { type: Date, required: true },
    subscribeEnd: { type: Date, required: true },
    countArticles: { type: Number, required: true }
  },
  {
    timestamps: false,
    collection: 'subscribe',
    versionKey: false
  }
);

export default model<Subscribe>('subscribe', subscribeSchema, 'subscribe');
