import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class Commnetdto {
  @ApiProperty()
  comment: string;

  @ApiProperty()
  photoId: string;
}
