import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as path from 'path';
import { editFileName, imageFileFilter } from '../../configs/uploadFile';
import { PhotosService } from './photos.service';
import { Photodto } from './photos.dto';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Post('api/photos')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(
    @UploadedFile() file,
    @Body() photodto: Photodto,
    @Res() res,
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    const link = path.join('./images', file.filename);
    console.log(link);
    const photo = await this.photosService.createPhoto(photodto, link);
    res.json({ photo, response });
  }
}
