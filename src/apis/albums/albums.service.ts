import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './albums.entity';
import {
  CreateAlbumDto,
  GetAllPhotoInAlbumdto,
  GetOneAlbumdto,
  UpdateAlbumdto,
} from './albums.dto';
import { PhotosService } from '../photos/photos.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
    private readonly photosService: PhotosService,
  ) {}

  public async createAlbumService(createAlbumDto: CreateAlbumDto, user: any) {
    const album = new Album();
    album.name = createAlbumDto.name;
    album.description = createAlbumDto.description;
    album.users = [user];
    const rs = await this.albumsRepository.save(album);
    return rs;
  }

  public async findOneAlbumService(getOneAlbumdto: GetOneAlbumdto) {
    const { id } = getOneAlbumdto;
    const rs = await this.albumsRepository.findOne({ where: { id } });
    return rs;
  }

  public async getAllPhotoInAlbum(
    getAllPhotoInAlbumdto: GetAllPhotoInAlbumdto,
  ) {
    const { id } = getAllPhotoInAlbumdto;
    const rs = await this.photosService.getAllPhotoInAlbum(id);
    return rs;
  }

  public async updateAlbum(updateAlbumDto: UpdateAlbumdto, id: string) {
    const { name, description, status } = updateAlbumDto;

    const album = await this.albumsRepository.findOne(id);
    album.name = name;
    album.description = description;
    album.status = status;

    const rs = await this.albumsRepository.save(album);

    return rs;
  }

  public async remove(id: any) {
    await this.albumsRepository.delete(id);
  }
}
