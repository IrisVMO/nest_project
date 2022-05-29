import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { DeleteOneUser, GetAllUserdto } from './users.dto';
import { Registerdto } from '../auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createUser(Registerdto: Registerdto) {
    try {
      const user = new User();
      user.seed = bcrypt.genSaltSync(10);
      user.username = Registerdto.username;
      user.email = Registerdto.email;
      user.password = bcrypt.hashSync(`${Registerdto.password}`, user.seed);

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

  public async findAllUser(getAllUserdto: GetAllUserdto) {
    const take = getAllUserdto.take || 10;
    const page = getAllUserdto.page || 1;
    const skip = (page - 1) * take;
    const filter = getAllUserdto.filter || '';

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
    const { id, newPassword } = filter;
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

  public async removeUser(deleteOneUser: DeleteOneUser) {
    try {
      const { id } = deleteOneUser;

      const rs = await this.usersRepository.delete(id);
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
