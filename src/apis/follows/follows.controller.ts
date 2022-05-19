import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateAlbumDto,
  GetOneAlbumdto,
  UpdateAlbumdto,
  DeleteAlbumdto,
} from './follows.dto';
import { MailService } from '../../configs/mail/mail.service';
import { FollowsService } from './follows.service';

@ApiTags('Albums')
@Controller('api/follows')
export class FollowsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const album = await this.albumsService.createAlbumService(
      createAlbumDto,
      userId,
    );
    res.json({ album });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getOneAlbum(@Res() res, @Param('id') id: GetOneAlbumdto) {
    const album = await this.albumsService.findOneAlbumService(id);
    res.json({ album });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  public async updateAlbum(@Body() updateAlbumDto: UpdateAlbumdto, @Res() res) {
    const album = await this.albumsService.updateAlbum(updateAlbumDto);
    res.json({ album });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async deleteAlbum(@Res() res, @Param('id') id: DeleteAlbumdto) {
    const album = await this.albumsService.remove(id);
    res.json({ album });
  }
}
