import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './likes.entity';
import { CountLikedto, Likedto, UnLikedto } from './likes.dto';
import { PhotosService } from '../photos/photos.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly photosService: PhotosService,
  ) {}

  public async createLike(likedto: Likedto, user: any) {
    const { photoId: id } = likedto;
    const { id: userId } = user;
    let like: Like;
    try {
      const photo = await this.photosService.getOnePhoto({ id });
      if (!photo) {
        throw new HttpException(
          "Can't to like the photo",
          HttpStatus.BAD_REQUEST,
        );
      }

      const { id: photoId } = photo;

      like = await this.likesRepository.findOne({ where: { userId, photoId } });

      if (like) {
        throw new HttpException('Like is exist', HttpStatus.CONFLICT);
      }

      like = new Like();
      like.user = user;
      like.photo = photo;

      const rs = await this.likesRepository.save(like);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async countLike(countLike: CountLikedto) {
    const { photoId } = countLike;
    try {
      const rs = await this.likesRepository.findAndCount({
        where: { photoId },
      });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async unLike(unLike: UnLikedto, userId: string) {
    const { photoId } = unLike;
    try {
      const like = await this.likesRepository.findOne({
        where: { userId, photoId },
      });

      const rs = await this.likesRepository.remove(like);
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
