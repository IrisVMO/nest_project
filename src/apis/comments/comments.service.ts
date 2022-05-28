import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosService } from '../photos/photos.service';
import { Comment } from './comments.entity';
import {
  Commentdto,
  UpdateCommentdto,
  DeleteCommentdto,
  GetAllCommentPhotodto,
  GetAllCommentPhotoPagedto,
} from './comments.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly photosService: PhotosService,
    private readonly usersService: UsersService,
  ) {}

  public async createComment(commentdto: Commentdto, userId: string) {
    const { comment, photoId: id } = commentdto;
    try {
      const user = await this.usersService.findOneUser({ id: userId });
      const photo = await this.photosService.getOnePhoto({ id }, userId);

      const comments = new Comment();
      comments.comment = comment;
      comments.photo = photo;
      comments.user = user;

      const rs = await this.commentsRepository.save(comments);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async getAllCommentPhoto(
    getAllCommentPhoto: GetAllCommentPhotodto,
    getAllCommentPhotoPagedto: GetAllCommentPhotoPagedto,
  ) {
    const take = getAllCommentPhotoPagedto.take || 10;
    const page = getAllCommentPhotoPagedto.page || 1;
    const skip = (page - 1) * take;
    try {
      const rs = await this.commentsRepository.findAndCount({
        where: { photoId: getAllCommentPhoto.photoId },
        order: { createdAt: 'ASC' },
        take: take,
        skip: skip,
      });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async updateComment(
    updateCommentdto: UpdateCommentdto,
    userId: string,
  ) {
    const { updateComment, photoId } = updateCommentdto;
    try {
      const comments = await this.commentsRepository.findOne({
        where: { photoId, userId },
      });

      comments.comment = updateComment;

      const rs = await this.commentsRepository.save(comments);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async deleteComment(deleteCommentdto: DeleteCommentdto) {
    const { id } = deleteCommentdto;
    try {
      const rs = await this.commentsRepository.delete({ id });
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
