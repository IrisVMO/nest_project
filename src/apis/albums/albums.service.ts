import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Album, AlbumUser, Role, StatusAlbumUser } from './albums.entity';
import {
  CreateAlbumDto,
  DeleteAlbumdto,
  InviteContributedto,
  SearchAlbumdto,
  ParamUpdateAlbumdto,
  UpdateAlbumdto,
} from './albums.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
    @InjectRepository(AlbumUser)
    private readonly albumUsersRepository: Repository<AlbumUser>,
  ) {}
  private readonly usersService: UsersService;

  public async createAlbumService(createAlbumDto: CreateAlbumDto, user: any) {
    const album = new Album();
    const albumUser = new AlbumUser();
    album.name = createAlbumDto.name;
    album.description = createAlbumDto.description;
    try {
      const data = await this.albumsRepository.save(album);

      albumUser.album = data;
      albumUser.user = user;
      albumUser.role = Role.Contribute;
      albumUser.status = StatusAlbumUser.Inactive;

      await this.albumUsersRepository.save(albumUser);
      return data;
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

  public async inviteContribute(inviteContributedto: InviteContributedto) {
    const { id, userContribueId } = inviteContributedto;
    const albumUser = new AlbumUser();
    try {
      const user = await this.usersService.findOneUser({ id: userContribueId });
      const album = await this.albumsRepository.findOne({ id });

      albumUser.album = album;
      albumUser.user = user;

      const rs = await this.albumUsersRepository.save(albumUser);
      return rs;
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
