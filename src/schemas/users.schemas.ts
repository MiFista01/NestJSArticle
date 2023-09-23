import { Schema, Document, model  } from 'mongoose';

export interface Users extends Document {
  name:string;
  email:string;
  bio:string;
  image: string;
  password:string;
  jwttoken:string;
}

export const usersSchema = new Schema<Users>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: false },
    image: { type: String, required: false, default: 'defaultico.png'},
    password:{type: String, required: true},
    jwttoken:{type: String, required: false, default: ''}
  },
  {
    timestamps: false,
    collection: 'user',
    versionKey: false
  }
);

export default model<Users>('user', usersSchema, 'user');