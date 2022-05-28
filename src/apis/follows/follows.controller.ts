import {
  Body,
  Controller,
  Delete,
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
    try {
      console.log('controller:', followdto, req.user);

      const data = await this.followsService.follow(followdto, req.user);

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async unFollow(
    @Body() unFollowdto: UnFollowdto,
    @Res() res,
    @Req() req,
  ) {
    console.log('unFollowdto:', unFollowdto);

    const { id: userId } = req.user;
    try {
      const data = await this.followsService.unFollow(unFollowdto, userId);

      res.json({ data });
    } catch (error) {
      console.log('error:', error);

      throw error;
    }
  }
}
