import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { configs } from '../config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'hotmail',
        auth: {
          user: configs.emailHelper,
          pass: configs.emailPassword,
        },
      },
      defaults: {
        from: 'Iris',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
