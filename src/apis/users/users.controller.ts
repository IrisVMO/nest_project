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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { MailService } from '../../configs/mail/mail.service';
// import { configs } from '../../configs/config';
import { UsersService } from './users.service';
import {
  CreateUserdto,
  VerifyAccountdto,
  Logindto,
  UpdateInfordto,
  ChangePassworddto,
  GetOneUserdto,
  // SearchUserdto,
  DeleteOneUser,
  GetAllUserdto,
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
    try {
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
      // const { id } = user;

      // if (process.env.NODE_ENV != 'test') {
      //   const tokenVerify = this.jwtService.sign({ id });
      //   const option = {
      //     from: configs.emailHelper,
      //     to: user.email,
      //     subject: 'Wellcom to UNIVERSE PHOTOS',
      //     html: `<p>
      //         Please verify your account
      //         <a href='http://${configs.host}:${configs.port}/api/users/verify/${tokenVerify}'>Verify Account</a>
      //       </p>`,
      //   };

      //   await this.usersService.updateInforService({ tokenVerify, id });
      //   this.mailService.sendMail(option);
      // }

      res.json({ data: user });
    } catch (error) {
      throw error;
    }
  }

  @Get('verify/:tokenVerify')
  public async verifyAccount(
    @Param() verifyAccountdto: VerifyAccountdto,
    @Res() res,
  ) {
    try {
      const { tokenVerify } = verifyAccountdto;
      const decode = this.jwtService.verify(tokenVerify);

      const data = await this.usersService.verifyAccount(decode.id);
      res.json(data);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  public async Login(@Body() loginDto: Logindto, @Res() res) {
    try {
      const { password } = loginDto;
      const user = await this.usersService.findOneUser(loginDto);

      if (!user) {
        throw new BadRequestException('Email or username wrong');
      }

      if (user.tokenVerify) {
        throw new BadRequestException(
          'Please verify account in your email address',
        );
      }

      const passwordCompare = bcrypt.hashSync(password, user.seed);

      if (passwordCompare != user.password) {
        throw new BadRequestException('Password wrong');
      }

      const { id, index } = user;
      const accessToken = this.jwtService.sign({ id, index });

      res.json({ data: user, accessToken });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async findAll(@Query() getAllUserdto: GetAllUserdto, @Res() res) {
    try {
      const data = await this.usersService.findAllUser(getAllUserdto);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('one/:id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async findOne(@Param() getOneUserdto: GetOneUserdto, @Res() res) {
    try {
      const data = await this.usersService.findOneUser(getOneUserdto);

      if (!data) {
        throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
      }

      res.json({ data });
    } catch (error) {
      throw error;
    }
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
    try {
      const user = await this.usersService.findOneUser({ id });
      const { password } = user;

      const passwordCompare = bcrypt.hashSync(currentPassword, user.seed);

      if (passwordCompare != password) {
        throw new HttpException('Password wrong', HttpStatus.BAD_REQUEST);
      }

      const index = Math.floor(Math.random() * 10000);

      const data = await this.usersService.changePasswordService({
        newPassword,
        id,
        index,
      });

      res.json({ data });
    } catch (error) {
      throw error;
    }
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
    try {
      const data = await this.usersService.updateInforService({
        ...updateUserDto,
        id,
      });

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async removeUser(@Param() deleteOneUser: DeleteOneUser, @Res() res) {
    try {
      const data = await this.usersService.removeUser(deleteOneUser);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
