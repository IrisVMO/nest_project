import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

export class Photodto {
  @ApiProperty()
  caption: string;
}

export class GetOnePhotodto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

export class UpdatePhotodto {
  @ApiProperty()
  caption: string;

  @ApiProperty({ enum: Status })
  status: Status;
}
