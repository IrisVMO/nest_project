import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  updateComment: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class GetAllCommentPhotoDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class GetAllCommentPhotoPageDto {
  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class DeleteCommentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
