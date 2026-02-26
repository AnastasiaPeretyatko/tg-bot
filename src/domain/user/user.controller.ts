import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAll() {
    return this.userService.getAll();
  }

  @Post()
  async create(@Body() dto: Omit<IUser, 'id'>) {
    return await this.userService.create(dto);
  }
}
