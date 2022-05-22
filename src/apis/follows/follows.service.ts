import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    // let follow: any;
    const { userIdFollowing } = followdto;
    const { id: userId } = user;

    let follow = await this.followsRepository.findOne({ where: { userId } });

    if (!follow) {
      follow = new Follow();
      follow.user = user;
      follow.userIdFollowing = [];
      follow.userIdFollowing.push(userIdFollowing);
    }

    if (follow) {
      const following = follow.userIdFollowing;
      const wasFollow = following.includes(userIdFollowing);
      if (wasFollow) {
        throw new HttpException('Followed this person', HttpStatus.CONFLICT);
      } else {
        follow.userIdFollowing.push(userIdFollowing);
      }
    }
    // follow.userIdFollowing = follow.userIdFollowing.push(userIdFollowing);
    // follow.userIdFollowing = follow.userIdFollowing.concat(userIdFollowing);

    const rs = await this.followsRepository.save(follow);
    return rs;
  }

  public async newFeed(userId: string) {
    const follow = await this.followsRepository.findOne({ where: { userId } });
    if (!follow) {
      throw new HttpException("You don't follow anyone", HttpStatus.NOT_FOUND);
    }
    const following = follow.userIdFollowing.concat(userId);

    const rs = await this.photosService.newFeed(following);
    return rs;
  }

  public async unFollow(unFollowdto: UnFollowdto, userId: string) {
    const { userIdFollowing } = unFollowdto;

    const follow = await this.followsRepository.findOne({ where: { userId } });

    follow.userIdFollowing = follow.userIdFollowing.filter(
      (list) => list !== userIdFollowing,
    );

    const rs = await this.followsRepository.save(follow);
    return rs;
  }
}
