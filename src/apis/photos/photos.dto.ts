import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class Photodto {
  @ApiProperty()
  caption: string;
}
