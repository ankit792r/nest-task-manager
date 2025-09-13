import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { IUser } from './interfaces/user';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async listUsers(page: number = 1, limit: number = 10) {
    const users = await this.userModel
      .find()
      .select('name email')
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
      .exec();
    return users;
  }

  async getUser(userId: string): Promise<IUser> {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .lean()
      .exec();

    if (!user) throw new Error('User does not exists');
    return user;
  }

  async createUser(data: CreateUserDto): Promise<IUser> {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) throw new Error('User already exists');
    const newUser = await this.userModel.create(data);
    newUser.password = '';
    return newUser;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $set: data,
        },
        { new: true, runValidators: true },
      )
      .select('-password')
      .lean()
      .exec();

    if (!updatedUser) throw new Error('Failed to update user');

    return updatedUser;
  }

  async deleteUser(userId: string) {
    await this.userModel.findByIdAndDelete(userId);
  }
}
