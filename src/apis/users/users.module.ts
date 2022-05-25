import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MailModule } from '../../configs/mail/mail.module';
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
    MailModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
