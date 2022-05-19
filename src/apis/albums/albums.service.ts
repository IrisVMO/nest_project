import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './albums.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
  ) {}

  public async createAlbumService(createAlbumDto, user: any) {
    const album = new Album();
    album.name = createAlbumDto.name;
    album.description = createAlbumDto.description;
    album.users = [user];
    const rs = await this.albumsRepository.save(album);
    return rs;
  }

  public async findOneAlbumService(id) {
    const rs = await this.albumsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    return rs;
  }

  public async updateAlbum(updateAlbumDto: any) {
    const { id, name, description, status } = updateAlbumDto;

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
