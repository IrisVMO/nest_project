import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosService } from '../photos/photos.service';
import { Followdto, UnFollowdto } from './follows.dto';
import { Follow } from './follows.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    private readonly photosService: PhotosService,
  ) {}

  public async follow(followdto: Followdto, user: any) {
    const { userIdFollowing } = followdto;
    const { id: userId } = user;
    console.log('Service userIdFollowing:', userIdFollowing);

    try {
      const IsAvailableFollow = await this.followsRepository.findOne({
        where: { userIdFollowing, userId },
      });

      if (IsAvailableFollow) {
        throw new BadRequestException('You followed this person');
      } else {
        const follow = new Follow();
        follow.userIdFollower = user.id;
        follow.userIdFollowing = userIdFollowing;
        follow.user = user;
        console.log('service follow:', follow);

        const rs = await this.followsRepository.save(follow);
        console.log('service rs:', rs);

        return rs;
      }
    } catch (error) {
      throw error;
    }
  }

  public async unFollow(unFollowdto: UnFollowdto, userId: string) {
    const { userIdFollowing } = unFollowdto;
    try {
      const follow = await this.followsRepository.findOne({
        where: { userIdFollowing, userIdFollower: userId },
      });

      const rs = await this.followsRepository.remove(follow);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async deletefollow(userId: string) {
    try {
      const followTable = await this.followsRepository.findOne({
        where: { userId },
      });

      const rs = await this.followsRepository.remove(followTable);
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
