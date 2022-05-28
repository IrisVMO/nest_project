import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

export enum StatusAlbumUser {
  Active = 'Active',
  Inactive = 'Inactive',
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
  @ApiProperty({ example: 'Seas', nullable: true })
  name: string;

  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class InviteContributedto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userContribueId: string;
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

export class UpdateAlbumParamdto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class AcceptContribueParamdto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class AcceptContribueQuerydto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tokenReply: string;

  @ApiProperty({ enum: StatusAlbumUser })
  @IsNotEmpty()
  @IsString()
  status: StatusAlbumUser;
}

export class DeleteAlbumdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
