import { Schema, Document, model, ObjectId   } from 'mongoose';

export interface Subscribe extends Document {
  id_user: ObjectId;
  type: number;
  end: number;
  update: number;
}

export const subscibeSchema = new Schema<Subscribe>(
  {
    id_user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    type: { type: Number, required: true },
    end: { type: Number, required: true },
    update: { type: Number, required: true }
  },
  {
    timestamps: false,
    collection: 'subscibe',
    versionKey: false
  }
);

export default model<Subscribe>('subscribe', subscibeSchema, 'subscibe');