import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
// import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class Likedto {
  @ApiProperty()
  @IsUUID()
  photoId: string;
}

export class CountLikedto {
  @ApiProperty()
  @IsUUID()
  photoId: string;
}

export class UnLikedto {
  @ApiProperty()
  @IsUUID()
  photoId: string;
}
