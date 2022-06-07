import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { DeleteOneUserDto, GetAllUserDto } from './users.dto';
import { RegisterDto } from '../auth/auth.dto';
import {
  ChangePassword,
  FindOneUserInterface,
  UpdateUserInterface,
} from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createUser(RegisterDto: RegisterDto) {
    try {
      const user = new User();
      user.seed = bcrypt.genSaltSync(10);
      user.username = RegisterDto.username;
      user.email = RegisterDto.email;
      user.password = bcrypt.hashSync(`${RegisterDto.password}`, user.seed);

      const rs = await this.usersRepository.save(user);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async verifyAccount(id: string) {
    try {
      const user = await this.usersRepository.findOne(id);

      if (!user) {
        throw new BadRequestException('Invalid verify your account');
      }

      user.tokenVerify = null;

      const rs = await this.usersRepository.save(user);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async findAllUser(getAllUserDto: GetAllUserDto) {
    const take = getAllUserDto.take || 10;
    const page = getAllUserDto.page || 1;
    const skip = (page - 1) * take;
    const filter = getAllUserDto.filter || '';

    try {
      const [result, total] = await this.usersRepository.findAndCount({
        where: { username: ILike(`%${filter}%`) },
        order: { username: 'ASC' },
        take: take,
        skip: skip,
      });

      return {
        data: result,
        count: total,
      };
    } catch (error) {
      throw error;
    }
  }

  public async findOneUser(findOneUserInterface: FindOneUserInterface) {
    const { id, username, email } = findOneUserInterface;
    try {
      const rs = await this.usersRepository.findOne({
        where: [{ email }, { username }, { id }],
      });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async updateUserInfo(updateUserInterface: UpdateUserInterface) {
    const { username, tokenVerify, email, status, id } = updateUserInterface;
    try {
      const user = await this.usersRepository.findOne(id);
      user.email = email;
      user.username = username;
      user.tokenVerify = tokenVerify;
      user.status = status;

      const rs = await this.usersRepository.save(user);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async changePassword(changePassword: ChangePassword) {
    const { id, newPassword } = changePassword;
    try {
      const user = await this.usersRepository.findOne(id);

      user.seed = bcrypt.genSaltSync(10);

      const password = bcrypt.hashSync(newPassword, user.seed);

      user.password = password;

      const rs = await this.usersRepository.save(user);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async removeUser(deleteOneUserDto: DeleteOneUserDto) {
    try {
      const { id } = deleteOneUserDto;

      const rs = await this.usersRepository.delete(id);
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
