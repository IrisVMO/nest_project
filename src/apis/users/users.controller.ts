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
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Signupdto, Logindto } from './users.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  public async sigup(@Body() createUserDto: Signupdto, @Res() res) {
    const data = await this.usersService.create(createUserDto);
    return res.json(data);
  }

  @Post('login')
  public async Login(@Body() loginDto: Logindto, @Res() res) {
    const user = await this.usersService.findOne(loginDto);
    if (!user) {
      throw new HttpException(
        'username or password wrong',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = bcrypt.compareSync(loginDto.password, user.password);
    if (!result) {
      throw new HttpException(
        'Username or password wrong',
        HttpStatus.NOT_FOUND,
      );
    }
    const { id } = user;
    const accessToken = this.jwtService.sign({ id });

    return res.json(HttpStatus.OK, { data: user, accessToken });
  }

  @UseGuards(AuthGuard())
  @Get()
  public async findAll(@Res() res) {
    const data = await this.usersService.findAll();
    return res.json(HttpStatus.OK, data);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  public async findOne(@Param('id') id: string, @Res() res, @Req() req) {
    return res.json(HttpStatus.OK, req.user);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  public async remove(@Param('id') id: string, @Res() res) {
    const data = await this.usersService.remove(id);
    return res.json(HttpStatus.OK, data);
  }
}
