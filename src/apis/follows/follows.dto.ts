import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Followdto {
  @ApiProperty()
  @IsNotEmpty()
  userIdFollowing: string;
}

export class UnFollowdto {
  @ApiProperty()
  @IsNotEmpty()
  userIdFollowing: string;
}
