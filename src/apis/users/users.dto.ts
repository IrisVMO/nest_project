import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class Signupdto {
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
  userName: string;

  @ApiProperty({ example: 'iris123@gmail.com' })
  email: string;
}

export class GetOneUser {
  @ApiProperty()
  id: string;
}

export class ChangePassworddto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class DeleteOneUser {
  @ApiProperty()
  id: string;
}
