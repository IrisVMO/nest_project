import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { FollowsModule } from '../follows/follows.module';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    FollowsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
