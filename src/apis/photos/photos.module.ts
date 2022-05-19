import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './photos.entity';
@Module({
  controllers: [PhotosController],
  imports: [TypeOrmModule.forFeature([Photo]), AuthModule],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
