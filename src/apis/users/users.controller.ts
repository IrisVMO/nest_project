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
  Patch,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { MailService } from '../../configs/mail/mail.service';
import { configs } from '../../configs/config';
import { UsersService } from './users.service';
import {
  CreateUserdto,
  VerifyAccountdto,
  Logindto,
  UpdateInfordto,
  ChangePassworddto,
  GetOneUserdto,
  SearchUserdto,
  DeleteOneUser,
} from './users.dto';

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
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 409, description: 'Confilic' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async sigup(@Body() createUserDto: CreateUserdto, @Res() res) {
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
    const { env } = createUserDto;
    if (env != 'test') {
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
      this.mailService.sendMail(option);
    }

    res.json({ data: user });
  }

  @Get('verify/:tokenVerify')
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async verifyAccount(
    @Param() verifyAccountdto: VerifyAccountdto,
    @Res() res,
  ) {
    const { tokenVerify } = verifyAccountdto;
    const decode = this.jwtService.verify(tokenVerify);
    const data = await this.usersService.verifyAccount(decode.id);
    res.json(data);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async Login(@Body() loginDto: Logindto, @Res() res) {
    const user = await this.usersService.findOneUser(loginDto);

    if (!user) {
      throw new HttpException(
        'Email or username wrong',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.tokenVerify) {
      throw new HttpException(
        'Please verify account in your email address',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = bcrypt.compareSync(loginDto.password, user.password);

    if (!result) {
      throw new HttpException('Password wrong', HttpStatus.BAD_REQUEST);
    }

    const { id, index } = user;
    const accessToken = this.jwtService.sign({ id, index });

    res.json({ data: user, accessToken });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async findAll(@Res() res) {
    const data = await this.usersService.findAllUser();
    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('one/:id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async findOne(@Param() getOneUserdto: GetOneUserdto, @Res() res) {
    const data = await this.usersService.findOneUser(getOneUserdto);

    if (!data) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }

    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('search/:username')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async searchUser(@Param() searchUserdto: SearchUserdto, @Res() res) {
    const data = await this.usersService.searchByUserName(searchUserdto);

    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('changePassword')
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
      throw new HttpException('Password wrong', HttpStatus.BAD_REQUEST);
    }

    const index = Math.floor(Math.random() * 10000);

    const data = await this.usersService.changePasswordService({
      newPassword,
      id,
      index,
    });

    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async remove(@Param() deleteOneUser: DeleteOneUser, @Res() res) {
    const data = await this.usersService.remove(deleteOneUser);
    res.json({ data });
  }
}
