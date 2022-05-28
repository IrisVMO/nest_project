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
import { AuthGuard } from '@nestjs/passport';
import { AlbumsService } from './albums.service';
import {
  CreateAlbumDto,
  GetOneAlbumdto,
  UpdateAlbumdto,
  UpdateAlbumParamdto,
  DeleteAlbumdto,
  SearchAlbumdto,
  InviteContributedto,
  AcceptContribueParamdto,
  AcceptContribueQuerydto,
} from './albums.dto';

@ApiTags('Albums')
@Controller('api/albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

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
    const { id: userId } = req.user;
    try {
      const data = await this.albumsService.createAlbumService(
        createAlbumDto,
        userId,
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
    @Req() req,
  ) {
    try {
      const { id: userId } = req.user;
      const data = await this.albumsService.findOneAlbumService(
        getOneAlbumdto,
        userId,
      );
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
  @Get('acceptContribue/:id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async reply(
    @Param() acceptContribueParam: AcceptContribueParamdto,
    @Query() acceptContribueQuery: AcceptContribueQuerydto,
    @Res() res,
  ) {
    try {
      const data = await this.albumsService.reply(
        acceptContribueParam,
        acceptContribueQuery,
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
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.albumsService.searchByAlbumName(
        searchPhotodto,
        userId,
      );
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
    @Param() paramUpdateAlbumdto: UpdateAlbumParamdto,
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
