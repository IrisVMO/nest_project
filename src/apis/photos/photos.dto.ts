import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export enum Status {
  Public = 'Public',
  Private = 'Private',
}

export class CreatePhotodto {
  @ApiProperty()
  caption: string;
}

export class GetOnePhotodto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class DeleteOnePhotodto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class UpdatePhotodto {
  @ApiProperty()
  @IsNotEmpty()
  caption: string;

  @ApiProperty({ enum: Status })
  status: Status;
}
