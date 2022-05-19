import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public sendMail(option) {
    console.log(option);
    this.mailerService
      .sendMail(option)
      .then(() => {
        console.log('Send mail for acount active successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
