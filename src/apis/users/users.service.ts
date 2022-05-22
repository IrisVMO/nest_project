import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserdto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserdto) {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = bcrypt.hashSync(`${createUserDto.password}`, 10);

    const rs = await this.usersRepository.save(user);
    return rs;
  }

  public async verifyAccount(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException(
        'Invalid verify your account',
        HttpStatus.NOT_FOUND,
      );
    }
    user.tokenVerify = null;

    const rs = await this.usersRepository.save(user);
    return rs;
  }

  public async findAllUser() {
    return await this.usersRepository.find();
  }

  public async findOneUser(filter: any) {
    const { id, username, email } = filter;

    if (!id) {
      const rs = await this.usersRepository.findOne({
        where: [{ email }, { username }],
      });
      return rs;
    }

    const rs = await this.usersRepository.findOne({
      where: { id },
      relations: ['follows'],
    });
    return rs;
  }

  public async findAuth(filter: any) {
    const { id, index } = filter;

    const rs = await this.usersRepository.findOne({ where: { id, index } });
    return rs;
  }

  public async updateInforService(updateUserDto: any) {
    const { id, username, tokenVerify, email } = updateUserDto;

    const user = await this.usersRepository.findOne(id);
    user.email = email;
    user.username = username;
    user.tokenVerify = tokenVerify;

    const rs = await this.usersRepository.save(user);

    return rs;
  }

  public async changePasswordService(filter: any) {
    const { id, newPassword, index } = filter;
    const password = bcrypt.hashSync(newPassword, 10);

    const user = await this.usersRepository.findOne(id);

    user.index = index;
    user.password = password;

    const rs = await this.usersRepository.save(user);
    return rs;
  }

  public async remove(id: any) {
    const rs = await this.usersRepository.delete(id);
    return rs;
  }
}
