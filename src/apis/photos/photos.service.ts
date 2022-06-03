import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AllPhotoInAlbum,
  AllPhotoInAlbumPage,
  CreatePhotodto,
  DeleteOnePhotodto,
  GetOnePhotodto,
  SearchPhotodto,
  UpdatePhotodto,
  UpdatePhotodtoParam,
} from './photos.dto';
import { AlbumsService } from '../albums/albums.service';
import { Photo, Status } from './photos.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>,
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async createPhoto(
    photodto: CreatePhotodto,
    link: string,
    userId: string,
  ) {
    const { caption, albumId } = photodto;
    try {
      const user = await this.usersService.findOneUser({ id: userId });
      const photo = new Photo();
      const album = await this.albumsService.findOneAlbumService(
        { id: albumId },
        userId,
      );

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

  public async getAllPhotoInAnAlbum(
    allPhotoInAlbum: AllPhotoInAlbum,
    allPhotoInAlbumPage: AllPhotoInAlbumPage,
  ) {
    const take = allPhotoInAlbumPage.take || 10;
    const page = allPhotoInAlbumPage.page || 1;
    const skip = (page - 1) * take;
    try {
      const rs = await this.photosRepository.findAndCount({
        where: { albumId: allPhotoInAlbum.albumId },
        order: { createdAt: 'ASC' },
        take: take,
        skip: skip,
      });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async updatePhoto(
    updatePhotodto: UpdatePhotodto,
    updatePhotodtoParam: UpdatePhotodtoParam,
  ) {
    const { caption, status } = updatePhotodto;
    const { id } = updatePhotodtoParam;
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

  public async getOnePhoto(getOnePhotodto: GetOnePhotodto, userId: string) {
    const { id } = getOnePhotodto;
    try {
      const rs = await this.photosRepository
        .createQueryBuilder('photo')
        .innerJoin('photo.album', 'album')
        .innerJoin('album.albumUsers', 'albumUser')
        .where('photo.id=:id', { id })
        .andWhere(
          `(photo.status=:status)
          OR (albumUser.role=:roleOwner AND albumUser.userId=:userId)
          OR (albumUser.status=:statusAlbumUserActive AND album.status=:statusAlbumPrivate 
            AND albumUser.role=:roleContribute AND albumUser.userId=:userId)`,
          {
            status: Status.Public,
            roleOwner: 'Owner',
            userId,
            statusAlbumUserActive: 'Active',
            statusAlbumPrivate: 'Private',
            roleContribute: 'Contribute',
          },
        )
        .getOne();

      if (!rs) {
        throw new ForbiddenException('Please join the album');
      }
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async searchByPhotoCaption(
    searchPhotodto: SearchPhotodto,
    userId: string,
  ) {
    const take = searchPhotodto.take || 10;
    const page = searchPhotodto.page || 1;
    const skip = (page - 1) * take;
    const search = searchPhotodto.search || '';
    try {
      const rs = await this.photosRepository
        .createQueryBuilder('photo')
        .select('photo')
        .innerJoin('photo.album', 'album')
        .innerJoin('album.albumUsers', 'albumUser')
        .where('photo.caption ILIKE :caption', { caption: `%${search}%` })
        .andWhere(
          `(photo.status=:status)
          OR (albumUser.role=:roleOwner AND albumUser.userId=:userId)
          OR (albumUser.status=:statusAlbumUserActive AND album.status=:statusAlbumPrivate 
            AND albumUser.role=:roleContribute AND albumUser.userId=:userId)`,
          {
            status: Status.Public,
            roleOwner: 'Owner',
            userId,
            statusAlbumUserActive: 'Active',
            statusAlbumPrivate: 'Private',
            roleContribute: 'Contribute',
          },
        )
        .orderBy('photo.caption', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async newFeed(userId: string) {
    const take = 10;
    try {
      const rs = await this.photosRepository
        .createQueryBuilder('photo')
        .innerJoin('photo.user', 'user')
        .innerJoin('user.follows', 'follow')
        .innerJoin('photo.album', 'album')
        .innerJoin('album.albumUsers', 'albumUser')
        .where('follow.userIdFollower=:userId', { userId })
        .andWhere(
          `(photo.status=:status)
          OR (albumUser.role=:roleOwner AND albumUser.userId=:userId)
          OR (albumUser.status=:statusAlbumUserActive AND album.status=:statusAlbumPrivate 
            AND albumUser.role=:roleContribute AND albumUser.userId=:userId)`,
          {
            status: Status.Public,
            roleOwner: 'Owner',
            userId,
            statusAlbumUserActive: 'Active',
            statusAlbumPrivate: 'Private',
            roleContribute: 'Contribute',
          },
        )
        .orderBy('photo.createdAt', 'DESC')
        .take(take)
        .getMany();

      return rs;
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
