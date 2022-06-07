import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class LikeDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class CountLikeDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class AllLikeInAPhotoPageDto {
  @ApiProperty()
  take: number;

  @ApiProperty()
  page: number;
}
