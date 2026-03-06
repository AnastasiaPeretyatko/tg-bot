import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
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

  @Get('/code/:id')
  async getTotpCode(@Req() request: Request, @Param('id') id: string) {
    return await this.userService.getCodeForAuthorization({ id });
  }

  @Post('/code')
  async verifyTotpCode(@Req() request: Request, @Body('code') code: string) {
    return await this.userService.verifyTotpCode(code);
  }
}
