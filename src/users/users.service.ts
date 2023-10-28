import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) public usersModel: Model<Users>) {}

  async getAllusers(): Promise<Users[]> {
    return await this.usersModel.find().exec();
  }

  async findUserById(id: string): Promise<Users | null> {
    const drink = await this.usersModel.findOne({ id: id }).exec();
    return drink;
  }
}
