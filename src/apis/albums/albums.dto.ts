import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

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
  @IsUUID()
  id: string;
}

export class GetAllPhotoInAlbumdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class SearchAlbumdto {
  @ApiProperty({ example: 'Seas' })
  name: string;
}

export class UpdateAlbumdto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: Status })
  status: Status;
}

export class ParamUpdateAlbumdto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class DeleteAlbumdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
