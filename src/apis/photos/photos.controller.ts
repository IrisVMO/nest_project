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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as path from 'path';
import { editFileName, imageFileFilter } from '../../configs/uploadFile';
import { PhotosService } from './photos.service';
import {
  CreatePhotodto,
  GetOnePhotodto,
  SearchPhotodto,
  UpdatePhotodto,
  DeleteOnePhotodto,
  AllPhotoInAlbum,
  AllPhotoInAlbumPage,
  UpdatePhotodtoParam,
} from './photos.dto';

@ApiTags('photos')
@Controller('api/photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        caption: {
          type: 'string',
        },
        albumId: {
          type: 'string',
          format: 'uuid',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  public async uploadedFile(
    @UploadedFile() file,
    @Body() photodto: CreatePhotodto,
    @Res() res,
    @Req() req,
  ) {
    const link = path.join('./images', file.filename);
    const { id: userId } = req.user;
    try {
      const data = await this.photosService.createPhoto(photodto, link, userId);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiResponse({ status: 201, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async updatePhoto(
    @Param() updatePhotodtoParam: UpdatePhotodtoParam,
    @Body() updatePhotodto: UpdatePhotodto,
    @Res() res,
  ) {
    try {
      const data = await this.photosService.updatePhoto(
        updatePhotodto,
        updatePhotodtoParam,
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
  public async getOnePhoto(
    @Param() getOnePhotodto: GetOnePhotodto,
    @Req() req,
    @Res() res,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.photosService.getOnePhoto(getOnePhotodto, userId);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allPhotoInAlbum/:albumId')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async allPhotoInAnAlbum(
    @Param() allPhotoInAlbum: AllPhotoInAlbum,
    @Query() allPhotoInAlbumPage: AllPhotoInAlbumPage,
    @Res() res,
  ) {
    try {
      const data = await this.photosService.getAllPhotoInAnAlbum(
        allPhotoInAlbum,
        allPhotoInAlbumPage,
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
    @Query() searchPhotodto: SearchPhotodto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.photosService.searchByPhotoCaption(
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
  @Get('newFeed')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async newFeed(@Res() res, @Req() req) {
    const { id: userId } = req.user;
    try {
      const data = await this.photosService.newFeed(userId);
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
  public async deleteOnePhoto(
    @Param() deleteOnePhotodto: DeleteOnePhotodto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const data = await this.photosService.deleteOnePhoto(deleteOnePhotodto);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
