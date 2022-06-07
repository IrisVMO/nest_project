import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosService } from '../photos/photos.service';
import { Comment } from './comments.entity';
import {
  CommentDto,
  UpdateCommentDto,
  DeleteCommentDto,
  GetAllCommentPhotoDto,
  GetAllCommentPhotoPageDto,
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

  public async createComment(commentDto: CommentDto, userId: string) {
    const { comment, photoId: id } = commentDto;
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
    getAllCommentPhoto: GetAllCommentPhotoDto,
    getAllCommentPhotoPageDto: GetAllCommentPhotoPageDto,
  ) {
    const take = getAllCommentPhotoPageDto.take || 10;
    const page = getAllCommentPhotoPageDto.page || 1;
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
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ) {
    const { updateComment, photoId } = updateCommentDto;
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

  public async deleteComment(deleteCommentDto: DeleteCommentDto) {
    const { id } = deleteCommentDto;
    try {
      const rs = await this.commentsRepository.delete({ id });
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
