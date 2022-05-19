import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Follow } from './follows.entity';

export class Followdto {
  @ApiProperty()
  userIdFollower: string;

  @ApiProperty()
  userIdFollowing: string;
}

export class GetOneAlbumdto {
  @ApiProperty()
  id: string;
}

export class UpdateAlbumdto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;
}

export class DeleteAlbumdto {
  @ApiProperty()
  id: string;
}
