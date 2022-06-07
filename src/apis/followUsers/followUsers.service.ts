import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FollowUserDto,
  ListFollowerDto,
  ListFollowingDto,
} from './followUsers.dto';
import { FollowUser } from './followUsers.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(FollowUser)
    private readonly followUserRepository: Repository<FollowUser>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async followUser(followUserDto: FollowUserDto, userId: string) {
    const { userIdFollowing } = followUserDto;
    try {
      const IsAvailableFollow = await this.followUserRepository.findOne({
        where: { userIdFollowing, userId },
      });

      if (IsAvailableFollow) {
        const rs = await this.followUserRepository.remove(IsAvailableFollow);
        return rs;
      } else {
        const followUser = new FollowUser();
        const user = await this.usersService.findOneUser({ id: userId });
        followUser.userIdFollower = user.id;
        followUser.userIdFollowing = userIdFollowing;
        followUser.user = user;

        const rs = await this.followUserRepository.save(followUser);
        return rs;
      }
    } catch (error) {
      throw error;
    }
  }

  public async listFollower(listFollowerDto: ListFollowerDto, userId: string) {
    const take = listFollowerDto.take || 10;
    const page = listFollowerDto.page || 1;
    const skip = (page - 1) * take;
    try {
      const rs = await this.followUserRepository
        .createQueryBuilder('followUsers')
        .leftJoin('followUsers.user', 'user')
        .addSelect('user.username')
        .where('followUsers.userIdFollowing=:userId', { userId })
        .orderBy('user.username', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async listFollowing(
    listFollowingDto: ListFollowingDto,
    userId: string,
  ) {
    const take = listFollowingDto.take || 10;
    const page = listFollowingDto.page || 1;
    const skip = (page - 1) * take;
    try {
      const rs = await this.followUserRepository
        .createQueryBuilder('followUsers')
        .leftJoin('followUsers.user', 'user')
        .addSelect('user.username')
        .where('followUsers.userIdFollower=:userId', { userId })
        .orderBy('user.username', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
