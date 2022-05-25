import { Module } from '@nestjs/common';
import { MailModule } from '../../configs/mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Album } from './albums.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PhotosModule } from '../photos/photos.module';

@Module({
  controllers: [AlbumsController],
  imports: [
    // forwardRef(() => PhotosModule),
    TypeOrmModule.forFeature([Album]),
    MailModule,
    AuthModule,
  ],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
