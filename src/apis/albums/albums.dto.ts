import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Seas' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
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
