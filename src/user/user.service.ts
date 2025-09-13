import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async listUsers(page: number = 1, limit: number = 10) {
    const userCountPromise = await this.userModel.countDocuments();
    const usersPromise = await this.userModel
      .find()
      .select('name email')
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const [count, users] = await Promise.all([userCountPromise, usersPromise]);
    const totalPages = Math.ceil(count / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        totalPages,
        count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();

    if (!user)
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user)
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(data: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser)
      throw new HttpException('User alredy exists', HttpStatus.BAD_REQUEST);
    const newUser = await this.userModel.create(data);
    newUser.password = '';
    return newUser;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
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

    if (!updatedUser)
      throw new HttpException('Failed to update user', HttpStatus.BAD_REQUEST);

    return updatedUser;
  }

  async deleteUser(userId: string) {
    await this.userModel.findByIdAndDelete(userId);
  }
}
