import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Likedto, CountLikedto, UnLikedto } from './likes.dto';
import { LikesService } from './likes.service';
// import { UsersService } from '../users/users.service';

@ApiTags('Likes')
@Controller('api/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async createLike(@Body() likedto: Likedto, @Res() res, @Req() req) {
    const data = await this.likesService.createLike(likedto, req.user);
    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allLikeInPhoto/:photoId')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async countLike(@Param() countLikedto: CountLikedto, @Res() res) {
    const data = await this.likesService.countLike(countLikedto);
    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async unLike(@Body() unLikedto: UnLikedto, @Res() res, @Req() req) {
    const { id: userId } = req.user;

    const data = await this.likesService.unLike(unLikedto, userId);
    res.json({ data });
  }
}
