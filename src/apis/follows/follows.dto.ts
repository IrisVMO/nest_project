import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class Followdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userIdFollowing: string;
}

export class UnFollowdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userIdFollowing: string;
}
