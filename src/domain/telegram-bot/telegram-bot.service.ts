import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';

@Update()
export class TelegramBotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.sendMessage(
      'Привет жми кнопку',
      Markup.keyboard(
        [
          Markup.button.callback('Регистрация', 'register'),
          Markup.button.callback('Инфа о пользователях', 'users'),
        ],
        {
          columns: 2,
        },
      ),
    );
  }
}

// @Injectable()
// export class TelegramBotService {
//   private bot: Telegraf<any>;

//   constructor(
//     private readonly logger: Logger,
//     private readonly configService: ConfigService,
//   ) {
//     this.logger = new Logger(TelegramBotService.name);

//     const token = this.configService.get<string>('telegram-bot.token');
//     if (!token) {
//       throw new Error('Telegram bot token is not defined!');
//     }
//     this.bot = new Telegraf(token);
//     this.bot.use(session());
//   }

//   public initBot() {
//     this.bot
//       .launch()
//       .then(() => this.logger.log('Bot launched'))
//       .catch((error) => this.logger.error(`${error}`));
//     this.logger.log('kek');
//     this.registerCommands();
//   }

//   private registerCommands() {
//     this.bot.command('start', (ctx) => ctx.reply('Welcome!'));
//     this.bot.command('help', (ctx) => ctx.reply('This is help message!'));
//   }
// }
