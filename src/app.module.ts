import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramBotModule } from './domain/telegram-bot/telegram-bot.module';
import { LoggerModule } from 'nestjs-pino';
import { pinoPrettyConfig } from './config/pino-pretty.config';
import { getControllerName } from './common/helpers/get-controller-name.helper';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from './domain/user/user.module';
import { SvcConfigModule } from './config/svc.config.module';
import { TelegramConfig } from './config/types';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: pinoPrettyConfig,
        customProps: (req) => ({
          context: getControllerName(req),
        }),
      },
    }),
    SvcConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<{ database: DataSourceOptions }, true>,
      ) => configService.get('database'),
    }),
    ScheduleModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<{ telegram: TelegramConfig }, true>,
      ) => configService.get('telegram'),
    }),
    TelegramBotModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
