import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Followdto } from './follows.dto';
import { Follow } from './follows.entity';
import { UsersService } from '../users/users.service';
@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    private readonly usersService: UsersService,
  ) {}

  public async follow(followdto: Followdto, user: any) {
    let follow: any;
    const { userIdFollowing } = followdto;
    const { id: userId } = user;
    follow = await this.followsRepository.findOne({ where: { userId } });

    if (!follow) {
      follow = new Follow();
      follow.user = user;
      follow.userIdFollowing = [];
      follow.userIdFollowing.push(userIdFollowing);
    }

    follow.userIdFollowing.push(userIdFollowing);

    const rs = await this.followsRepository.save(follow);
    return rs;
  }

  public async unFollow(followdto: Followdto) {
    const { userIdFollowing } = followdto;
    const rs = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Follow)
      .where('userIdFollowing = :userIdFollowing', { userIdFollowing })
      .execute();
    return rs;
  }
}
