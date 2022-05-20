import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { FollowsController } from './follows.controller';
import { Follow } from './follows.entity';
import { FollowsService } from './follows.service';

@Module({
  controllers: [FollowsController],
  imports: [TypeOrmModule.forFeature([Follow]), AuthModule, UsersModule],
  providers: [FollowsService],
})
export class FollowsModule {}
