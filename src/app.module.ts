import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import dbConfig from 'db/config/db-config';
import { ScheduleModule } from '@nestjs/schedule';
import telegramConfig from './config/telegram.config';
import { TelegramBotModule } from './domain/telegram-bot/telegram-bot.module';
import { LoggerModule } from 'nestjs-pino';
import { pinoPrettyConfig } from './config/pino-pretty.config';
import { getControllerName } from './common/helpers/get-controller-name.helper';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from './domain/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        `.env`,
      ],
      isGlobal: true,
      cache: true,
      load: [dbConfig, telegramConfig],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: pinoPrettyConfig,
        customProps: (req) => ({
          context: getControllerName(req),
        }),
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<{ database: DataSourceOptions }, true>,
      ) => configService.get('database'),
    }),
    ScheduleModule.forRoot(), // обязательно для активации планировщика
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<{ 'telegram-bot': { token: string } }>,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const telegramConfig = configService.get('telegram-bot');

        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          token: telegramConfig?.token,
        };
      },
    }),
    TelegramBotModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
