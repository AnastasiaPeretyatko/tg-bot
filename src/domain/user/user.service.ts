import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUser } from './types';
import { generate, verify } from 'otplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private secret: string;

  constructor(
    private readonly datasource: DataSource,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(UserService.name);
    this.secret = this.configService.get<string>('service.otp') || '';
  }

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

  async getCodeForAuthorization({ id }: { id: string }) {
    const existUser = await this.getBy({ id });
    if (!existUser) throw new Error('Пользователь не найден!');
    try {
      const otp = await generate({ secret: this.secret });
      return { code: otp };
    } catch (error) {
      throw new Error(`Ошибка ${error}`);
    }
  }

  async verifyTotpCode(code: string) {
    const { valid } = await verify({ secret: this.secret, token: code });
    return { valid };
  }
}
