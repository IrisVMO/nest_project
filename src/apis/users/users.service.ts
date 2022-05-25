import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FollowsService } from '../follows/follows.service';
import { User } from './users.entity';
import { CreateUserdto, DeleteOneUser, GetAllUserdto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly followsService: FollowsService,
  ) {}

  public async create(createUserDto: CreateUserdto) {
    try {
      const user = new User();
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      user.password = bcrypt.hashSync(`${createUserDto.password}`, 10);
      const rs = await this.usersRepository.save(user);
      await this.followsService.createFollow(rs);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async verifyAccount(id: string) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  public async findAllUser(getAllUserdto: GetAllUserdto) {
    const take = getAllUserdto.take || 10;
    const page = getAllUserdto.page || 1;
    const skip = (page - 1) * take;
    const filter = getAllUserdto.filter || '';

    try {
      const [result, total] = await this.usersRepository.findAndCount({
        where: { username: Like(`%${filter}%`) },
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

  public async findOneUser(filter: any) {
    const { id, username, email } = filter;
    try {
      if (!id) {
        const rs = await this.usersRepository.findOne({
          where: [{ email }, { username }],
        });
        return rs;
      }

      const rs = await this.usersRepository.findOne(id);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async findAuth(filter: any) {
    const { id, index } = filter;
    try {
      const rs = await this.usersRepository.findOne({ where: { id, index } });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async updateInforService(updateUserField: any) {
    const { id, username, tokenVerify, email } = updateUserField;
    try {
      const user = await this.usersRepository.findOne(id);
      user.email = email;
      user.username = username;
      user.tokenVerify = tokenVerify;

      const rs = await this.usersRepository.save(user);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async changePasswordService(filter: any) {
    const { id, newPassword, index } = filter;
    try {
      const password = bcrypt.hashSync(newPassword, 10);

      const user = await this.usersRepository.findOne(id);

      user.index = index;
      user.password = password;

      const rs = await this.usersRepository.save(user);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async remove(deleteOneUser: DeleteOneUser) {
    try {
      const { id } = deleteOneUser;
      await this.followsService.deletefollow(id);

      const rs = await this.usersRepository.delete(id);
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
