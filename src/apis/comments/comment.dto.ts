import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class Commentdto {
  @ApiProperty()
  comment: string;

  @ApiProperty()
  photoId: string;
}

export class UpdateCommentdto {
  @ApiProperty()
  updateComment: string;

  @ApiProperty()
  photoId: string;
}

export class GetAllCommentPhoto {
  @ApiProperty()
  photoId: string;
}

export class DeleteCommentdto {
  @ApiProperty()
  photoId: string;
}
