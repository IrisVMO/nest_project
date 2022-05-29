import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { configs } from '../../configs/config';
import { MailService } from '../../configs/mail/mail.service';
import { UsersService } from '../users/users.service';
import { Registerdto, Logindto, VerifyAccountdto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  public async register(registerdto: Registerdto) {
    try {
      const isExistEmail = await this.usersService.findOneUser({
        email: registerdto.email,
      });

      if (isExistEmail) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const isExistUsername = await this.usersService.findOneUser({
        username: registerdto.username,
      });

      if (isExistUsername) {
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }

      const user = await this.usersService.createUser(registerdto);
      const { id } = user;

      if (process.env.NODE_ENV != 'test') {
        const tokenVerify = this.jwtService.sign({ id });
        const option = {
          from: configs.emailHelper,
          to: user.email,
          subject: 'Wellcom to UNIVERSE PHOTOS',
          html: `<p>
              Please verify your account
              <a href='http://${configs.host}:${configs.port}/api/auth/verify/${tokenVerify}'>Verify Account</a>
            </p>`,
        };

        await this.usersService.updateInforService({ tokenVerify, id });
        this.mailService.sendMail(option);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async verifyAccount(verifyAccountdto: VerifyAccountdto) {
    const { tokenVerify } = verifyAccountdto;
    try {
      const decode = this.jwtService.verify(tokenVerify);
      const user = await this.usersService.findOneUser({ id: decode.id });

      if (!user) {
        throw new BadRequestException('Invalid verify your account');
      }

      const rs = await this.usersService.updateInforService({
        tokenVerify: null,
        id: user.id,
      });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async login(logindto: Logindto) {
    try {
      const { password } = logindto;
      const user = await this.usersService.findOneUser(logindto);

      if (!user) {
        throw new BadRequestException('Email or username wrong');
      }

      if (user.tokenVerify) {
        throw new BadRequestException('Please verify your account');
      }

      const passwordCompare = bcrypt.hashSync(password, user.seed);

      if (passwordCompare != user.password) {
        throw new BadRequestException('Password wrong');
      }

      const { id } = user;
      const accessToken = this.jwtService.sign({ id });
      return accessToken;
    } catch (error) {
      throw error;
    }
  }
}
