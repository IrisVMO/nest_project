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
  GetOneAlbumDto,
  UpdateAlbumDto,
  UpdateAlbumParamDto,
  DeleteAlbumDto,
  SearchAlbumDto,
  InviteContributeDto,
  AcceptContribueParamDto,
  AcceptContribueQueryDto,
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
    @Param() getOneAlbumDto: GetOneAlbumDto,
    @Req() req,
  ) {
    try {
      const { id: userId } = req.user;
      const data = await this.albumsService.findOneAlbumService(
        getOneAlbumDto,
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
    @Body() inviteContributeDto: InviteContributeDto,
  ) {
    try {
      const data = await this.albumsService.inviteContribute(
        inviteContributeDto,
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
    @Param() acceptContribueParam: AcceptContribueParamDto,
    @Query() acceptContribueQuery: AcceptContribueQueryDto,
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
    @Query() searchPhotoDto: SearchAlbumDto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.albumsService.searchByAlbumName(
        searchPhotoDto,
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
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param() paramUpdateAlbumDto: UpdateAlbumParamDto,
    @Res() res,
  ) {
    try {
      const data = await this.albumsService.updateAlbum(
        updateAlbumDto,
        paramUpdateAlbumDto,
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
    @Param() deleteAlbumDto: DeleteAlbumDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.albumsService.remove(deleteAlbumDto, userId);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
