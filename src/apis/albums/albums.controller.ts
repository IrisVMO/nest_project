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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AlbumsService } from './albums.service';
import {
  CreateAlbumDto,
  GetOneAlbumdto,
  GetAllPhotoInAlbumdto,
  UpdateAlbumdto,
  DeleteAlbumdto,
  ParamUpdateAlbumdto,
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
    const data = await this.albumsService.createAlbumService(
      createAlbumDto,
      req.user,
    );

    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getOneAlbum(
    @Res() res,
    @Param() getOneAlbumdto: GetOneAlbumdto,
  ) {
    const data = await this.albumsService.findOneAlbumService(getOneAlbumdto);
    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allPhotoInAlbum/:id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getAllPhotoInAlbum(
    @Res() res,
    @Param() getAllPhotoInAlbumdto: GetAllPhotoInAlbumdto,
  ) {
    const data = await this.albumsService.getAllPhotoInAlbum(
      getAllPhotoInAlbumdto,
    );
    res.json({ data });
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
    const data = await this.albumsService.updateAlbum(
      updateAlbumDto,
      paramUpdateAlbumdto,
    );
    res.json({ data });
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
    const data = await this.albumsService.remove(deleteAlbumdto);
    res.json({ data });
  }
}
