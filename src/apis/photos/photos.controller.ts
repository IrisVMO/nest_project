import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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
import { GetOnePhotodto, Photodto, UpdatePhotodto } from './photos.dto';

@ApiTags('photos')
@Controller('api/photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        caption: {
          type: 'string',
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
    @Body() photodto: any,
    @Res() res,
    @Req() req,
  ) {
    console.log(file);
    const link = path.join('./images', file.filename);
    console.log(photodto, link, req.user);

    const photo = await this.photosService.createPhoto(
      photodto,
      link,
      req.user,
    );
    res.json({ photo });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiResponse({ status: 201, description: 'Updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async updatePhoto(
    @Param() id: string,
    @Body() updatePhotodto: UpdatePhotodto,
    @Res() res,
  ) {
    const data = await this.photosService.updatePhoto(updatePhotodto, id);
    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async getOnePhoto(
    @Param() getOnePhotodto: GetOnePhotodto,
    @Req() req,
    @Res() res,
  ) {
    const data = await this.photosService.getOnePhoto(getOnePhotodto);
    res.json({ data });
  }
}
