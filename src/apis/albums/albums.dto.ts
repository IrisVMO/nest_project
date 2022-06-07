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

export class GetOneAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class GetAllPhotoInAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class SearchAlbumDto {
  @ApiProperty({ example: 'Seas', nullable: true })
  name: string;

  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class InviteContributeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userContribueId: string;
}

export class UpdateAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: Status })
  status: Status;
}

export class UpdateAlbumParamDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class AcceptContribueParamDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class AcceptContribueQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tokenReply: string;

  @ApiProperty({ enum: StatusAlbumUser })
  @IsNotEmpty()
  @IsString()
  status: StatusAlbumUser;
}

export class DeleteAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
