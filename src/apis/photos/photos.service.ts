import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photodto } from './photos.dto';
import { Photo } from './photos.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly phtosRepository: Repository<Photo>,
  ) {}

  public async createPhoto(photodto: Photodto, link: string) {
    const { caption } = photodto;
    const photo = new Photo();
    photo.caption = caption;
    photo.link = link;
    const rs = await this.phtosRepository.save(photo);
    return rs;
  }
}
