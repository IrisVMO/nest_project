import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PhotosModule } from '../photos/photos.module';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  imports: [TypeOrmModule.forFeature([Comment]), AuthModule, PhotosModule],
  providers: [CommentsService],
})
export class CommentsModule {}
