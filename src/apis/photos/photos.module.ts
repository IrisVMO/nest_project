import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './photos.entity';
import { AlbumsModule } from '../albums/albums.module';

@Module({
  controllers: [PhotosController],
  imports: [TypeOrmModule.forFeature([Photo]), AlbumsModule, AuthModule],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
