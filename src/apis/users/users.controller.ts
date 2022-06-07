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
  Req,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import {
  UpdateInforDto,
  ChangePasswordDto,
  GetOneUserDto,
  DeleteOneUserDto,
  GetAllUserDto,
} from './users.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async findAll(@Query() getAllUserDto: GetAllUserDto, @Res() res) {
    try {
      const data = await this.usersService.findAllUser(getAllUserDto);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('getOne/:id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async findOne(@Param() getOneUserDto: GetOneUserDto, @Res() res) {
    try {
      const data = await this.usersService.findOneUser(getOneUserDto);

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
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res,
    @Req() req,
  ) {
    const { currentPassword, newPassword } = changePasswordDto;
    const { id } = req.user;
    try {
      const user = await this.usersService.findOneUser({ id });
      const { password } = user;

      const passwordCompare = bcrypt.hashSync(currentPassword, user.seed);

      if (passwordCompare != password) {
        throw new HttpException('Password wrong', HttpStatus.BAD_REQUEST);
      }

      const data = await this.usersService.changePassword({
        newPassword,
        id,
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
    @Body() updateUserDto: UpdateInforDto,
    @Res() res,
    @Req() req,
  ) {
    const { id } = req.user;
    try {
      const data = await this.usersService.updateUserInfo({
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
  public async removeUser(
    @Param() deleteOneUser: DeleteOneUserDto,
    @Res() res,
  ) {
    try {
      const data = await this.usersService.removeUser(deleteOneUser);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
