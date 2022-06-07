import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LikeDto, CountLikeDto, AllLikeInAPhotoPageDto } from './likes.dto';
import { LikesService } from './likes.service';

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
  public async createLike(@Body() likeDto: LikeDto, @Res() res, @Req() req) {
    const { id: userId } = req.user;
    try {
      const data = await this.likesService.createLike(likeDto, userId);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allLikeInPhoto/:photoId')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async allLikeInPhoto(
    @Param() countLikeDto: CountLikeDto,
    @Query() allLikeInAPhotoPageDto: AllLikeInAPhotoPageDto,
    @Res() res,
  ) {
    try {
      const data = await this.likesService.allLikeInPhoto(
        countLikeDto,
        allLikeInAPhotoPageDto,
      );
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
