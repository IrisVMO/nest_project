import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './albums.entity';
import {
  CreateAlbumDto,
  DeleteAlbumdto,
  // InviteContributedto,
  SearchAlbumdto,
  ParamUpdateAlbumdto,
  UpdateAlbumdto,
} from './albums.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
  ) {}

  public async createAlbumService(createAlbumDto: CreateAlbumDto, user: any) {
    const album = new Album();
    album.name = createAlbumDto.name;
    album.description = createAlbumDto.description;
    album.users = [user];
    try {
      const rs = await this.albumsRepository.save(album);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async findOneAlbumService(getOneAlbumdto: any) {
    const { id } = getOneAlbumdto;
    try {
      const rs = await this.albumsRepository.findOne({ where: { id } });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async searchByAlbumName(searchAlbumdto: SearchAlbumdto) {
    const take = searchAlbumdto.take || 10;
    const page = searchAlbumdto.page || 1;
    const skip = (page - 1) * take;
    const filter = searchAlbumdto.filter || '';

    try {
      const [result, total] = await this.albumsRepository.findAndCount({
        where: { name: Like(`%${filter}%`) },
        order: { name: 'ASC' },
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

  public async inviteContribute() {
    // const { albumId, userContribueId: userId } = inviteContributedto;
    try {
      // const rs = this.albumsRepository.query(
      //   `INSERT INTO AlbumUser (albumId, userId, role, status)
      //   VALUES ('${albumId}', '${userId}', 'Contribute', '${StatusAlbumUser.Inactive}')`,
      // );
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async updateAlbum(
    updateAlbumDto: UpdateAlbumdto,
    paramUpdateAlbumdto: ParamUpdateAlbumdto,
  ) {
    const { name, description, status } = updateAlbumDto;
    const { id } = paramUpdateAlbumdto;
    try {
      const album = await this.albumsRepository.findOne(id);
      album.name = name;
      album.description = description;
      album.status = status;

      const rs = await this.albumsRepository.save(album);

      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async remove(deleteAlbumdto: DeleteAlbumdto) {
    try {
      const { id } = deleteAlbumdto;
      await this.albumsRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
