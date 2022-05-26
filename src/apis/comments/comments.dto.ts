import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class Commentdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class UpdateCommentdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  updateComment: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class GetAllCommentPhotodto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class GetAllCommentPhotoPagedto {
  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class DeleteCommentdto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
