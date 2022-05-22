import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PhotosModule } from '../photos/photos.module';
import { FollowsController } from './follows.controller';
import { Follow } from './follows.entity';
import { FollowsService } from './follows.service';

@Module({
  controllers: [FollowsController],
  imports: [TypeOrmModule.forFeature([Follow]), AuthModule, PhotosModule],
  providers: [FollowsService],
})
export class FollowsModule {}
