import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

export class CreateAlbumDto {
  @ApiProperty({ example: 'Seas' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class GetOneAlbumdto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

export class GetAllPhotoInAlbumdto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

export class UpdateAlbumdto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: Status })
  status: Status;
}

export class DeleteAlbumdto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
