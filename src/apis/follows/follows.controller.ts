import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FollowsService } from './follows.service';
import { Followdto } from './follows.dto';

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
}
