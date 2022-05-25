import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
// import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

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

export class UnLikedto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}
