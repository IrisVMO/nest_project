import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from '../../configs/mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Album } from './albums.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AlbumsController],
  imports: [
    TypeOrmModule.forFeature([Album]),
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
