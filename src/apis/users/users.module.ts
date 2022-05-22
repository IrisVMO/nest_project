import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../../configs/mail/mail.module';
import { User } from './users.entity';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    MulterModule.register({
      dest: './files',
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
