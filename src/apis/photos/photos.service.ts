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
  AllPhotoInAlbumParamDto,
  AllPhotoInAlbumQueryDto,
  CreatePhotoDto,
  DeleteOnePhotoDto,
  GetOnePhotoDto,
  SearchPhotoDto,
  UpdatePhotoDto,
  UpdatePhotoDtoParam,
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
    photoDto: CreatePhotoDto,
    link: string,
    userId: string,
  ) {
    const { caption, albumId } = photoDto;
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
    allPhotoInAlbum: AllPhotoInAlbumParamDto,
    allPhotoInAlbumPage: AllPhotoInAlbumQueryDto,
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
    updatePhotoDto: UpdatePhotoDto,
    updatePhotoDtoParam: UpdatePhotoDtoParam,
  ) {
    const { caption, status } = updatePhotoDto;
    const { id } = updatePhotoDtoParam;
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

  public async getOnePhoto(getOnePhotoDto: GetOnePhotoDto, userId: string) {
    const { id } = getOnePhotoDto;
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
    searchPhotoDto: SearchPhotoDto,
    userId: string,
  ) {
    const take = searchPhotoDto.take || 10;
    const page = searchPhotoDto.page || 1;
    const skip = (page - 1) * take;
    const search = searchPhotoDto.search || '';
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
        .innerJoin('user.followUsers', 'followUsers')
        .innerJoin('photo.album', 'album')
        .innerJoin('album.albumUsers', 'albumUser')
        .where('followUsers.userIdFollower=:userId', { userId })
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

  public async deleteOnePhoto(deleteOnePhotoDto: DeleteOnePhotoDto) {
    try {
      const { id } = deleteOnePhotoDto;

      const rs = await this.photosRepository.delete({ id });
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
