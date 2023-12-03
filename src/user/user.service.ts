import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<User>,
      ) {}


    async findOne(username: string): Promise<User> {
        return this.UserModel.findOne({ username }).exec();
    }

    async findById(id: string): Promise<User> {
        return this.UserModel.findById(id).exec();
    }

    async createUser(username: string, pass: string) {
        try {
          const user = new this.UserModel({ username, password: pass });
          return await user.save();
        } catch (error) {
          // Check if the error is due to a duplicate key violation
          if (error.code === 11000) {
            throw new ConflictException('Username is already taken');
          }
          // Re-throw the error if it's not a duplicate key violation
          throw error;
        }
    }
}
