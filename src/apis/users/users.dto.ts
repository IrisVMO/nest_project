import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum Status {
  Busy = 'Busy',
  Active = 'Active',
}

export class CreateUserdto {
  @ApiProperty({ example: 'Iris123' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  username: string;

  @ApiProperty({ example: 'iris123@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class VerifyAccountdto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tokenVerify: string;
}

export class Logindto {
  @ApiProperty({ example: 'Iris123' })
  username: string;

  @ApiProperty({ example: 'iris123@gmail.com' })
  email: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class UpdateInfordto {
  @ApiProperty({ example: 'Iris123' })
  username: string;

  @ApiProperty({ example: 'iris123@gmail.com' })
  email: string;

  @ApiProperty({ enum: Status })
  status: Status;
}

export class SearchUserdto {
  @ApiProperty({ nullable: true })
  username: string;
}

export class GetAllUserdto {
  @ApiProperty({ nullable: true })
  filter: string;

  @ApiProperty({ nullable: true })
  take: number;

  @ApiProperty({ nullable: true })
  page: number;
}

export class GetOneUserdto {
  @ApiProperty({ nullable: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class ChangePassworddto {
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

export class DeleteOneUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
