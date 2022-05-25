import { Injectable } from '@nestjs/common';
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

  public async createFollow(user: any) {
    try {
      const follow = new Follow();
      follow.user = user;

      const rs = await this.followsRepository.save(follow);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async deletefollow(userId: string) {
    try {
      const rs = await this.followsRepository.findOne({ where: userId });
      return await this.followsRepository.remove(rs);
    } catch (error) {
      throw error;
    }
  }

  public async follow(followdto: Followdto, userId: string) {
    try {
      const { userIdFollowing } = followdto;

      const [follower, following] = await Promise.all([
        this.followsRepository.findOne({ where: { userId } }),
        this.followsRepository.findOne({ where: { userId: userIdFollowing } }),
      ]);

      follower.userIdFollowing.push(userIdFollowing);
      following.userIdFollower.push(userId);

      const rs = await Promise.all([
        this.followsRepository.save(follower),
        this.followsRepository.save(following),
      ]);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async newFeed(userId: string) {
    try {
      const follow = await this.followsRepository.findOne({
        where: { userId },
      });
      const following = follow.userIdFollowing.concat(userId);

      const rs = await this.photosService.newFeed(following);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async unFollow(unFollowdto: UnFollowdto, userId: string) {
    const { userIdFollowing } = unFollowdto;
    try {
      const [follower, following] = await Promise.all([
        this.followsRepository.findOne({ where: { userId } }),
        this.followsRepository.findOne({ where: { userId: userIdFollowing } }),
      ]);

      follower.userIdFollowing = follower.userIdFollowing.filter(
        (list) => list !== userIdFollowing,
      );
      following.userIdFollower = follower.userIdFollower.filter(
        (list) => list !== userId,
      );

      const rs = await await Promise.all([
        this.followsRepository.save(follower),
        this.followsRepository.save(following),
      ]);
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
