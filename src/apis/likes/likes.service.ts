import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './likes.entity';
import {
  AllLikeInAPhotoPagedto,
  CountLikedto,
  Likedto,
  UnLikedto,
} from './likes.dto';
import { PhotosService } from '../photos/photos.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly photosService: PhotosService,
    private readonly usersService: UsersService,
  ) {}

  public async createLike(likedto: Likedto, userId: string) {
    const { photoId: id } = likedto;
    let like: Like;
    try {
      const user = await this.usersService.findOneUser({ id: userId });
      const photo = await this.photosService.getOnePhoto({ id }, userId);

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

  public async allLikeInPhoto(
    countLike: CountLikedto,
    allLikeInAPhotoPagedto: AllLikeInAPhotoPagedto,
  ) {
    const take = allLikeInAPhotoPagedto.take || 10;
    const page = allLikeInAPhotoPagedto.page || 1;
    const skip = (page - 1) * take;
    try {
      const rs = await this.likesRepository.findAndCount({
        where: { photoId: countLike.photoId },
        take: take,
        skip: skip,
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
