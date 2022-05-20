import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Followdto } from './follows.dto';
// import { MailService } from '../../configs/mail/mail.service';
import { FollowsService } from './follows.service';

@ApiTags('Follows')
@Controller('api/follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async follow(@Body() followdto: Followdto, @Res() res, @Req() req) {
    // const { id: userId } = req.user;
    const data = await this.followsService.follow(followdto, req.user);

    res.json({ data });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  public async unFollow(@Body() followdto: Followdto, @Res() res) {
    const data = await this.followsService.unFollow(followdto);

    res.json({ data });
  }
}
