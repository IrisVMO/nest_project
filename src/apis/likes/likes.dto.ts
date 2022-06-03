import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class Likedto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class CountLikedto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class AllLikeInAPhotoPagedto {
  @ApiProperty()
  take: number;

  @ApiProperty()
  page: number;
}
