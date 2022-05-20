import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  UseGuards,
  Delete,
  Get,
  Res,
  Param,
  Post,
  Req,
  // UseInterceptors,
  // UploadedFile,
  Patch,
  Inject,
} from '@nestjs/common';
import {
  Signupdto,
  Logindto,
  UpdateInfordto,
  ChangePassworddto,
  GetOneUser,
  DeleteOneUser,
} from './users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { MailService } from '../../configs/mail/mail.service';
import { configs } from '../../configs/config';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  @Post('signup')
  public async sigup(@Body() createUserDto: Signupdto, @Res() res) {
    const isExistEmail = await this.usersService.findOneUser({
      email: createUserDto.email,
    });

    if (isExistEmail) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const isExistUsername = await this.usersService.findOneUser({
      username: createUserDto.username,
    });

    if (isExistUsername) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const user = await this.usersService.create(createUserDto);
    const { id } = user;
    const tokenVerify = this.jwtService.sign({ id });
    const option = {
      from: configs.emailHelper,
      to: user.email,
      subject: 'Wellcom to UNIVERSE PHOTOS',
      html: `<p>
          Please verify your account
          <a href='http://${configs.host}:${configs.port}/api/users/verify/${tokenVerify}'>Verify Account</a>
        </p>`,
    };

    await this.usersService.updateInforService({ tokenVerify, id });
    // this.mailService.sendMail(option);

    res.json({ data: user });
  }

  @Get('verifyAcount')
  public async verifyAccount(@Res() res) {
    const id = '';
    const data = await this.usersService.verifyAccount(id);
    res.json(data);
  }

  @Post('login')
  public async Login(@Body() loginDto: Logindto, @Res() res) {
    const user = await this.usersService.findOneUser(loginDto);

    if (!user) {
      throw new HttpException('Email or username wrong', HttpStatus.NOT_FOUND);
    }
    // if (user.tokenVerify) {
    //   throw new HttpException('Please verify account', HttpStatus.BAD_REQUEST);
    // }

    const result = bcrypt.compareSync(loginDto.password, user.password);

    if (!result) {
      throw new HttpException('Password wrong', HttpStatus.NOT_FOUND);
    }

    const { id, index } = user;
    const accessToken = this.jwtService.sign({ id, index });

    res.json({ data: user, accessToken });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(@Res() res) {
    const data = await this.usersService.findAllUser();
    res.json(data);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async findOne(@Param('id') id: GetOneUser, @Res() res) {
    console.log(id);

    const user = await this.usersService.findOneUser({ id });
    console.log('user', user);

    res.json(user);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  public async updateInfor(
    @Body() updateUserDto: UpdateInfordto,
    @Res() res,
    @Req() req,
  ) {
    const { id } = req.user;
    const data = await this.usersService.updateInforService({
      ...updateUserDto,
      id,
    });

    res.json({ data });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('changePassword')
  public async changePassword(
    @Body() changePassworddto: ChangePassworddto,
    @Res() res,
    @Req() req,
  ) {
    const { currentPassword, newPassword } = changePassworddto;
    const { id } = req.user;
    const user = await this.usersService.findOneUser({ id });
    const { password } = user;

    const result = bcrypt.compareSync(currentPassword, password);

    if (!result) {
      throw new HttpException('Password wrong', HttpStatus.NOT_FOUND);
    }

    const index = Math.floor(Math.random() * 10000);

    const data = await this.usersService.changePasswordService({
      newPassword,
      id,
      index,
    });

    res.json({ data });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: DeleteOneUser, @Res() res) {
    const data = await this.usersService.remove(id);
    res.json(HttpStatus.OK, data);
  }
}
