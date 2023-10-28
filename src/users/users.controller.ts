import {
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './schema/users.schema';
import { JwtAuthGuard } from 'src/utils/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.getAllusers();
  }

  @Get('/details/:id')
  async findUserById(@Param('id') id: string): Promise<Users | null> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`KK`);
    }
    return user;
  }
}
