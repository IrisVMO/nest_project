import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { Signupdto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: Signupdto) {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = bcrypt.hashSync(`${createUserDto.password}`, 10);

    const rs = await this.usersRepository.save(user);
    return rs;
  }

  public async findAll() {
    return await this.usersRepository.find();
  }

  public async findOne(filter: any) {
    const { id, username, email } = filter;
    console.log('filter:', filter);
    console.log('email:', filter.email);

    if (!id) {
      const rs = await this.usersRepository.findOne({
        where: [{ email }, { username }],
      });
      return rs;
    }

    const rs = await this.usersRepository.findOne(id);
    console.log('rs:', rs);

    return rs;
  }

  public async remove(id: string) {
    await this.usersRepository.delete(id);
  }
}
