import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUser } from './types';

@Injectable()
export class UserService {
  constructor(private readonly datasource: DataSource) {}

  async getAll() {
    const query = await this.datasource
      .getRepository(UserEntity)
      .createQueryBuilder('users')
      .getMany();

    return query;
  }

  async getBy(data: Partial<IUser>) {
    const user = this.datasource.getRepository(UserEntity);

    return await user.findOneBy(data);
  }

  async create(dto: Omit<IUser, 'id'>) {
    const existUser = await this.getBy({ username: dto.username });

    if (existUser) throw new Error('Пользователь уже создан!');
    const user = this.datasource.getRepository(UserEntity).save(dto);

    return user;
  }
}
