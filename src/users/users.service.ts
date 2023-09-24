import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/users.schemas';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('Users') private readonly userModel: Model<Users>,
    ) { }

  async createUser(userData: Users): Promise<Users> {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  async findUserById(id: string): Promise<Users | null> {
    const user = await this.userModel.findById(id)
    return user
  }

  async findAllUsers(): Promise<Users[]> {
    const Users = await this.userModel.find().exec()
    return Users
  }
  async findCountUsers(): Promise<number> {
    const count = await this.userModel.countDocuments().exec()
    return count
  }
  async searchUsers(search: string): Promise<Users[]> {
    const users = await this.userModel.aggregate([
        {
            $match: {
                $or: [
                    { name: { $regex: new RegExp(search, 'i') } },
                    { email: { $regex: new RegExp(search, 'i') } },
                    { bio: { $regex: new RegExp(search, 'i') } }
                ]
            }
        }
    ]).exec();

    return users;
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; 
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
  async updateUser(id: string, updatedData: Partial<Users>,): Promise<Users | null> {
    return await this.userModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndRemove(id).exec();
  }
}
