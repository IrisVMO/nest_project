import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

export class CreatePhotoDto {
  @ApiProperty({ example: 'Mot ngay nang rat to ...' })
  caption: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  albumId: string;
}

export class AllPhotoInAlbumParamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  albumId: string;
}

export class AllPhotoInAlbumQueryDto {
  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class GetOnePhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class SearchPhotoDto {
  @ApiProperty({ nullable: true })
  search: string;

  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class DeleteOnePhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class UpdatePhotoDtoParam {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
export class UpdatePhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  caption: string;

  @ApiProperty({ enum: Status })
  status: Status;
}
