import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FollowsService } from './follows.service';
import { Followdto, UnFollowdto } from './follows.dto';

@ApiTags('Follows')
@Controller('api/follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async follow(@Body() followdto: Followdto, @Res() res, @Req() req) {
    const { id: userId } = req.user;
    try {
      const data = await this.followsService.follow(followdto, userId);

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('newFeed')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async newFeed(@Req() req, @Res() res) {
    const { id: userId } = req.user;
    try {
      const data = await this.followsService.newFeed(userId);
      res.json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async unFollow(
    @Body() unFollowdto: UnFollowdto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.followsService.unFollow(unFollowdto, userId);

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
