import { Schema, Document, model, ObjectId   } from 'mongoose';

export interface Subscribe extends Document {
  id_user: ObjectId;
  sub_id: ObjectId;
  start: Date;
  monthEnd:Date;
  subscribeEnd: Date;
  countArticle: number;
}

export const subscribeSchema = new Schema<Subscribe>(
  {
    id_user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    sub_id: { type: Schema.Types.ObjectId, required: true, ref: 'subscribe_type' },
    start: { type: Date, required: true },
    monthEnd: { type: Date, required: true },
    subscribeEnd: { type: Date, required: true },
    countArticle:{type: Number, required: true}
  },
  {
    timestamps: false,
    collection: 'subscribe',
    versionKey: false
  }
);

export default model<Subscribe>('subscribe', subscribeSchema, 'subscribe');