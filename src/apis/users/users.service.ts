import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: any) {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = bcrypt.hashSync(`${createUserDto.password}`, 10);

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

    const rs = await this.usersRepository.findOne(id);
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

  public async verifyAccount(id: any) {
    const user = await this.usersRepository.findOne(id);
    user.tokenVerify = null;

    const rs = await this.usersRepository.save(user);
    return rs;
  }

  public async changePasswordService(filter: any) {
    const { id, newPassword, index } = filter;
    const password = bcrypt.hashSync(newPassword, 10);
    console.log('info:', filter);

    const user = await this.usersRepository.findOne(id);
    console.log(user);

    user.index = index;
    user.password = password;

    const rs = await this.usersRepository.save(user);
    console.log('update', rs);

    return rs;
  }

  public async remove(id: any) {
    await this.usersRepository.delete(id);
  }
}
