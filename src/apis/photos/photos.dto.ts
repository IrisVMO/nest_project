import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

export class CreatePhotodto {
  @ApiProperty({ example: 'Mot ngay nang rat to ...' })
  caption: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  albumId: string;
}

export class AllPhotoInAlbum {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  albumId: string;
}

export class AllPhotoInAlbumPage {
  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class GetOnePhotodto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class SearchPhotodto {
  @ApiProperty({ nullable: true })
  search: string;

  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class DeleteOnePhotodto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class UpdatePhotodtoParam {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
export class UpdatePhotodto {
  @ApiProperty()
  @IsNotEmpty()
  caption: string;

  @ApiProperty({ enum: Status })
  status: Status;
}
