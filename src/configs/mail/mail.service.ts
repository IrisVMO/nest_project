import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import { error } from 'console';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public sendMail(option) {
    this.mailerService
      .sendMail(option)
      .then()
      .catch((err) => {
        throw new HttpException('Mailler error', err);
      });
  }
}
