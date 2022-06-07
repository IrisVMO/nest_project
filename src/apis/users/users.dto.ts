import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export enum Status {
  Busy = 'Busy',
  Active = 'Active',
}

export class UpdateInforDto {
  @ApiProperty({ example: 'Iris123' })
  username: string;

  @ApiProperty({ example: 'iris123@gmail.com' })
  email: string;

  @ApiProperty({ enum: Status })
  status: Status;
}

export class SearchUserDto {
  @ApiProperty({ nullable: true })
  username: string;
}

export class GetAllUserDto {
  @ApiProperty({ nullable: true })
  filter: string;

  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class GetOneUserDto {
  @ApiProperty({ nullable: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class DeleteOneUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
