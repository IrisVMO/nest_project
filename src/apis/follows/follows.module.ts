import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';

@Module({
  controllers: [FollowsController],
  imports: [AuthModule],
  providers: [FollowsService],
})
export class FollowsModule {}
