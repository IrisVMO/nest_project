import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Followdto } from './follows.dto';
import { Follow } from './follows.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
  ) {}

  public async follow(followdto: Followdto, user: any) {
    const { userIdFollowing } = followdto;
    const { id: userId } = user;
    try {
      const IsAvailableFollow = await this.followsRepository.findOne({
        where: { userIdFollowing, userId },
      });

      if (IsAvailableFollow) {
        const rs = await this.followsRepository.remove(IsAvailableFollow);
        return rs;
      } else {
        const follow = new Follow();
        follow.userIdFollower = user.id;
        follow.userIdFollowing = userIdFollowing;
        follow.user = user;

        const rs = await this.followsRepository.save(follow);
        return rs;
      }
    } catch (error) {
      throw error;
    }
  }
}
