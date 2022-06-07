import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { configs } from '../../configs/config';
import { MailService } from '../../configs/mail/mail.service';
import { UsersService } from '../users/users.service';
import {
  Album,
  AlbumUser,
  Role,
  StatusAlbumUser,
  Status,
} from './albums.entity';
import {
  CreateAlbumDto,
  DeleteAlbumDto,
  InviteContributeDto,
  SearchAlbumDto,
  UpdateAlbumParamDto,
  UpdateAlbumDto,
  AcceptContribueParamDto,
  AcceptContribueQueryDto,
  GetOneAlbumDto,
} from './albums.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
    @InjectRepository(AlbumUser)
    private readonly albumUsersRepository: Repository<AlbumUser>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  public async createAlbumService(
    createAlbumDto: CreateAlbumDto,
    userId: string,
  ) {
    const album = new Album();
    const albumUser = new AlbumUser();
    album.name = createAlbumDto.name;
    album.description = createAlbumDto.description;
    try {
      const user = await this.usersService.findOneUser({ id: userId });
      const data = await this.albumsRepository.save(album);

      albumUser.album = data;
      albumUser.user = user;
      albumUser.role = Role.Owner;
      albumUser.status = StatusAlbumUser.Active;

      await this.albumUsersRepository.save(albumUser);
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async findOneAlbumService(
    getOneAlbumDto: GetOneAlbumDto,
    userId: string,
  ) {
    const { id } = getOneAlbumDto;
    try {
      const albumUser = await this.albumUsersRepository.findOne({
        where: { albumId: id, userId: userId },
      });

      if (!albumUser || albumUser.status != 'Active') {
        throw new ForbiddenException('Please join the album');
      }

      const rs = await this.albumsRepository.findOne(id);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async searchByAlbumName(
    searchAlbumDto: SearchAlbumDto,
    userId: string,
  ) {
    const take = searchAlbumDto.take || 10;
    const page = searchAlbumDto.page || 1;
    const skip = (page - 1) * take;
    const name = searchAlbumDto.name || '';
    try {
      const rs = await this.albumsRepository
        .createQueryBuilder('album')
        .leftJoin('album.albumUsers', 'albumUser')
        .where('album.name ILIKE :name', { name: `%${name}%` })
        .andWhere(
          `(albumUser.role=:roleOwner AND albumUser.userId=:userId) 
          OR (albumUser.status=:statusAlbumUser AND album.status=:statusPrivate
            AND albumUser.role=:roleContribute AND albumUser.userId=:userId)
          OR (album.status=:statusPublic)`,
          {
            roleOwner: Role.Owner,
            roleContribute: Role.Contribute,
            statusAlbumUser: StatusAlbumUser.Active,
            statusPublic: Status.Public,
            statusPrivate: Status.Private,
            userId,
          },
        )
        .orderBy('album.name', 'ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async inviteContribute(inviteContributeDto: InviteContributeDto) {
    const { id, userContribueId } = inviteContributeDto;
    const albumUser = new AlbumUser();
    try {
      const user = await this.usersService.findOneUser({ id: userContribueId });
      const album = await this.albumsRepository.findOne(id);
      if (!user || !album) {
        throw new BadRequestException('Can not invite contributor');
      }

      const { name } = album;
      albumUser.album = album;
      albumUser.user = user;
      albumUser.role = Role.Contribute;
      albumUser.status = StatusAlbumUser.Inactive;

      const rs = await this.albumUsersRepository.save(albumUser);

      const tokenReply = this.jwtService.sign({ id: user.id });
      const option = {
        from: configs.emailHelper,
        to: user.email,
        subject: 'Wellcom to UNIVERSE PHOTOS',
        html: `<p>
              Please reply to contribute the album ${name}
              <a href='http://${configs.host}:${configs.port}/api/albums/acceptContribue/${id}?tokenReply=${tokenReply}&status=Active'>Accept</a> ||
              <a href='http://${configs.host}:${configs.port}/api/albums/acceptContribue/${id}?tokenReply=${tokenReply}&status=Inactive'>Reject</a>
            </p>`,
      };

      this.mailService.sendMail(option);

      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async reply(
    acceptContribueParam: AcceptContribueParamDto,
    acceptContribueQuery: AcceptContribueQueryDto,
  ) {
    try {
      const { id } = acceptContribueParam;
      const { status, tokenReply } = acceptContribueQuery;
      const decode = this.jwtService.verify(tokenReply);
      if (!decode) {
        throw new UnauthorizedException('Accept contribute the album fail');
      }

      const albumUser = await this.albumUsersRepository.findOne({
        where: { albumId: id, userId: decode.id },
      });

      albumUser.status = status;
      const rs = await this.albumUsersRepository.save(albumUser);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async updateAlbum(
    updateAlbumDto: UpdateAlbumDto,
    paramUpdateAlbumDto: UpdateAlbumParamDto,
  ) {
    const { name, description, status } = updateAlbumDto;
    const { id } = paramUpdateAlbumDto;
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

  public async remove(deleteAlbumDto: DeleteAlbumDto, userId: string) {
    try {
      const { id } = deleteAlbumDto;

      const albumUser = await this.albumUsersRepository.findOne({
        where: { albumId: id, userId },
      });

      if (!albumUser || albumUser.role != 'Owner') {
        throw new ForbiddenException('You can permission to delete the album');
      } else {
        const rs = await this.albumsRepository.delete({ id });
        return rs;
      }
    } catch (error) {
      throw error;
    }
  }
}
