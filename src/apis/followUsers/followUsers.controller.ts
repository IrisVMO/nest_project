import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FollowsService } from './followUsers.service';
import {
  FollowUserDto,
  ListFollowerDto,
  ListFollowingDto,
} from './followUsers.dto';

@ApiTags('FollowUsers')
@Controller('api/followUsers')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async followUser(
    @Body() followUserDto: FollowUserDto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.followsService.followUser(followUserDto, userId);

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allFollower')
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getAllFollower(
    @Param() listFollowerDto: ListFollowerDto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.followsService.listFollower(
        listFollowerDto,
        userId,
      );

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allFollowing')
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async allFollowing(
    @Param() listFollowingDto: ListFollowingDto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.followsService.listFollowing(
        listFollowingDto,
        userId,
      );

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
