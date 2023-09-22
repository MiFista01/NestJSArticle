import { Schema, Document, model  } from 'mongoose';

export interface Users extends Document {
  name:string;
  email:string;
  bio:string;
  image: string;
}

export const usersSchema = new Schema<Users>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: false,
    collection: 'user',
  }
);

export default model<Users>('user', usersSchema, 'user');