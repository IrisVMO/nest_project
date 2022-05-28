import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PhotosModule } from '../photos/photos.module';
import { UsersModule } from '../users/users.module';
import { LikesController } from './likes.controller';
import { Like } from './likes.entity';
import { LikesService } from './likes.service';

@Module({
  controllers: [LikesController],
  imports: [
    TypeOrmModule.forFeature([Like]),
    AuthModule,
    PhotosModule,
    UsersModule,
  ],
  providers: [LikesService],
})
export class LikesModule {}
