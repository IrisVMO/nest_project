import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class Likedto {
  @ApiProperty()
  photoId: string;
}

export class CountLikedto {
  @ApiProperty()
  photoId: string;
}

export class UnLikedto {
  @ApiProperty()
  photoId: string;
}
