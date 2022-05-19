import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FollowsController } from './follows.controller';
import { Follow } from './follows.entity';
import { FollowsService } from './follows.service';

@Module({
  controllers: [FollowsController],
  imports: [TypeOrmModule.forFeature([Follow]), AuthModule],
  providers: [FollowsService],
})
export class FollowsModule {}
