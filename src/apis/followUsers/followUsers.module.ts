import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PhotosModule } from '../photos/photos.module';
import { UsersModule } from '../users/users.module';
import { FollowsController } from './followUsers.controller';
import { FollowUser } from './followUsers.entity';
import { FollowsService } from './followUsers.service';

@Module({
  controllers: [FollowsController],
  imports: [
    TypeOrmModule.forFeature([FollowUser]),
    AuthModule,
    PhotosModule,
    forwardRef(() => UsersModule),
  ],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
