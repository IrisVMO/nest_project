import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import {
  CreatePhotodto,
  DeleteOnePhotodto,
  GetOnePhotodto,
  SearchPhotodto,
  UpdatePhotodto,
} from './photos.dto';
import { Photo } from './photos.entity';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>,
    private readonly albumsService: AlbumsService,
  ) {}

  public async createPhoto(photodto: CreatePhotodto, link: string, user: any) {
    const { caption, albumId } = photodto;
    try {
      const photo = new Photo();
      const album = await this.albumsService.findOneAlbumService({
        id: albumId,
      });

      photo.caption = caption;
      photo.link = link;
      photo.user = user;
      photo.album = album;

      const rs = await this.photosRepository.save(photo);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async updatePhoto(updatePhotodto: UpdatePhotodto, id: string) {
    const { caption, status } = updatePhotodto;

    try {
      const photo = await this.photosRepository.findOne(id);
      if (!photo) {
        throw new HttpException(
          'Photo not found to update',
          HttpStatus.NOT_FOUND,
        );
      }

      photo.caption = caption;
      photo.status = status;

      const rs = await this.photosRepository.save(photo);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async newFeed(following: any) {
    try {
      const rs = await this.photosRepository.find({
        where: { userId: In(following) },
        order: { createdat: 'DESC' },
      });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async getOnePhoto(getOnePhotodto: GetOnePhotodto) {
    const { id } = getOnePhotodto;
    try {
      const rs = await this.photosRepository.findOne({
        where: { id },
        relations: ['likes', 'comments'],
      });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async searchByPhotoCaption(searchPhotodto: SearchPhotodto) {
    const take = searchPhotodto.take || 10;
    const page = searchPhotodto.page || 1;
    const skip = (page - 1) * take;
    const filter = searchPhotodto.filter || '';
    try {
      const [result, total] = await this.photosRepository.findAndCount({
        where: { caption: Like(`%${filter}%`) },
        order: { caption: 'ASC' },
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

  public async deleteOnePhoto(deleteOnePhotodto: DeleteOnePhotodto) {
    try {
      const { id } = deleteOnePhotodto;

      const rs = await this.photosRepository.delete({ id });
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
