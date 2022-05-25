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

export class GetAllCommentPhoto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  photoId: string;
}

export class DeleteCommentdto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
