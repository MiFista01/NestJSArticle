import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/users.schemas';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('Users') private readonly userModel: Model<Users>,
    ) { }

  async createUser(userData: Users): Promise<Users> {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }
  async checkJWT(token: string): Promise<jwt.JwtPayload | null> {
    try {
      const user = await jwt.verify(token, process.env.SECRET_KEY);
      return user as jwt.JwtPayload;
    } catch (error) {
        return null;
    }
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; 
    return bcrypt.hash(password, saltRounds);
  }
  async updateUser(id: string, updatedData: Partial<Users>,): Promise<Users | null> {
    return await this.userModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();
  }
  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndRemove(id).exec();
  }

  async findUserById(id: string): Promise<Users | null> {
    const user = await this.userModel.findById(id).select("-password").exec();
    return user
  }

  async findAllUsers(): Promise<Users[]> {
    const Users = await this.userModel.find().select("-password").exec()
    return Users
  }
  async findCountUsers(): Promise<number> {
    const count = await this.userModel.countDocuments().exec()
    return count
  }
  async searchUsers(search: {
    name?:{value:string, ec:false},
    email?:{value:string, ec:false},
    bio?:{value:string, ec:false}
  }): Promise<{users:Users[], count:number}> {
    
    let queryMatch = []
    if (search.name !== undefined) {
      if(search.name.ec){
        queryMatch.push({ name: { $regex: new RegExp(search.name.value, 'i') } })
      }else{
        queryMatch.push({ name: search.name.value})
      }
    }
    if(search.email !== undefined) {
      if(search.email.ec){
        queryMatch.push({ email: { $regex: new RegExp(search.email.value, 'i') } })
      }else{
        queryMatch.push({ email: search.email.value})
      }
    }
    if(search.bio !== undefined) {
      if(search.bio.ec){
        queryMatch.push({ bio: { $regex: new RegExp(search.bio.value, 'i') } })
      }else{
        queryMatch.push({ bio: search.bio.value})
      }
    }
    const users = await this.userModel.aggregate([
        {
            $match: {
                $or: queryMatch
            }
        }
    ]).exec();
    const count = users.length
    return {users, count};
  }
}
