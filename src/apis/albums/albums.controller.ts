import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AlbumsService } from './albums.service';
import {
  CreateAlbumDto,
  GetOneAlbumdto,
  UpdateAlbumdto,
  DeleteAlbumdto,
  ParamUpdateAlbumdto,
  SearchAlbumdto,
  InviteContributedto,
} from './albums.dto';
import { MailService } from '../../configs/mail/mail.service';

@ApiTags('Albums')
@Controller('api/albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @Res() res,
    @Req() req,
  ) {
    try {
      const data = await this.albumsService.createAlbumService(
        createAlbumDto,
        req.user,
      );
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('getOne/:id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getOneAlbum(
    @Res() res,
    @Param() getOneAlbumdto: GetOneAlbumdto,
  ) {
    try {
      const data = await this.albumsService.findOneAlbumService(getOneAlbumdto);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('inviteContribute')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async inviteContribute(
    @Res() res,
    @Body() inviteContributedto: InviteContributedto,
  ) {
    try {
      const data = await this.albumsService.inviteContribute(
        inviteContributedto,
      );
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async searchPhoto(
    @Query() searchPhotodto: SearchAlbumdto,
    @Res() res,
  ) {
    try {
      const data = await this.albumsService.searchByAlbumName(searchPhotodto);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async updateAlbum(
    @Body() updateAlbumDto: UpdateAlbumdto,
    @Param() paramUpdateAlbumdto: ParamUpdateAlbumdto,
    @Res() res,
  ) {
    try {
      const data = await this.albumsService.updateAlbum(
        updateAlbumDto,
        paramUpdateAlbumdto,
      );
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
  public async deleteAlbum(
    @Res() res,
    @Param() deleteAlbumdto: DeleteAlbumdto,
  ) {
    try {
      const data = await this.albumsService.remove(deleteAlbumdto);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
