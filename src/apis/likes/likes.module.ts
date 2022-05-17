import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  controllers: [LikesController],
  imports: [AuthModule],
  providers: [LikesService],
})
export class LikesModule {}
