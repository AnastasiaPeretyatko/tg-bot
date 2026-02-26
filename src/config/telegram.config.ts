import { registerAs } from '@nestjs/config';

import { TelegramConfig } from './types';

export default registerAs('telegram-bot', (): TelegramConfig => {
  return {
    token: process.env.TELEGRAM_BOT_ACCESS_KEY || '',
  };
});
