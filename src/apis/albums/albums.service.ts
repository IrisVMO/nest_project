import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './albums.entity';
import {
  CreateAlbumDto,
  DeleteAlbumdto,
  GetAllPhotoInAlbumdto,
  GetOneAlbumdto,
  SearchAlbumdto,
  ParamUpdateAlbumdto,
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

  public async searchByAlbumName(searchAlbumdto: SearchAlbumdto) {
    const { name } = searchAlbumdto;
    const rs = await this.albumsRepository.find({
      name: Like(`%${name}%`),
    });

    return rs;
  }

  public async getAllPhotoInAlbum(
    getAllPhotoInAlbumdto: GetAllPhotoInAlbumdto,
  ) {
    const { id } = getAllPhotoInAlbumdto;
    const rs = await this.photosService.getAllPhotoInAlbum(id);
    return rs;
  }

  public async updateAlbum(
    updateAlbumDto: UpdateAlbumdto,
    paramUpdateAlbumdto: ParamUpdateAlbumdto,
  ) {
    const { name, description, status } = updateAlbumDto;
    const { id } = paramUpdateAlbumdto;

    const album = await this.albumsRepository.findOne(id);
    album.name = name;
    album.description = description;
    album.status = status;

    const rs = await this.albumsRepository.save(album);

    return rs;
  }

  public async remove(deleteAlbumdto: DeleteAlbumdto) {
    const { id } = deleteAlbumdto;
    await this.albumsRepository.delete({ id });
  }
}
