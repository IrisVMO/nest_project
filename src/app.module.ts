import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configs } from './configs/config';
import { UsersModule } from './apis/users/users.module';
import { AlbumsModule } from './apis/albums/albums.module';
import { PhotosModule } from './apis/photos/photos.module';
import { LikesModule } from './apis/likes/likes.module';
import { CommentsModule } from './apis/comments/comments.module';
import { FollowsModule } from './apis/follows/follows.module';
// import { APP_FILTER } from '@nestjs/core';
// import { AllExceptionsFilter } from './configs/all-exeptions.filter';
// import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(configs.db),
    UsersModule,
    AlbumsModule,
    PhotosModule,
    LikesModule,
    CommentsModule,
    FollowsModule,
  ],
  providers: [],
})
export class AppModule {}
