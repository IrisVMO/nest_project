import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FollowUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userIdFollowing: string;
}

export class ListFollowerDto {
  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class ListFollowingDto {
  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}
