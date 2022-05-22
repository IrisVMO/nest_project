import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  CreatePhotodto,
  DeleteOnePhotodto,
  GetOnePhotodto,
  UpdatePhotodto,
} from './photos.dto';
import { Photo } from './photos.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>,
  ) {}

  public async createPhoto(photodto: CreatePhotodto, link: string, user: any) {
    const { caption } = photodto;
    const photo = new Photo();
    photo.caption = caption;
    photo.link = link;
    photo.user = user;
    const rs = await this.photosRepository.save(photo);
    return rs;
  }

  public async getAllPhotoInAlbum(albumId: string) {
    const rs = await this.photosRepository.find({ where: { albumId } });
    return rs;
  }

  public async updatePhoto(updatePhotodto: UpdatePhotodto, id: string) {
    const { caption, status } = updatePhotodto;

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
  }

  public async newFeed(following: any) {
    const rs = await this.photosRepository.find({
      where: { userId: In(following) },
      order: { createdat: 'DESC' },
    });
    return rs;
  }

  public async getOnePhoto(getOnePhotodto: GetOnePhotodto) {
    const { id } = getOnePhotodto;

    const rs = await this.photosRepository.findOne(id);
    return rs;
  }

  public async deleteOnePhoto(deleteOnePhotodto: DeleteOnePhotodto) {
    const { id } = deleteOnePhotodto;

    const rs = await this.photosRepository.delete({ id });
    return rs;
  }
}
