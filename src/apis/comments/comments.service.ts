import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosService } from '../photos/photos.service';
import { Comment } from './comments.entity';
import {
  Commentdto,
  UpdateCommentdto,
  DeleteCommentdto,
  GetAllCommentPhoto,
} from './comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly photosService: PhotosService,
  ) {}

  public async createComment(commentdto: Commentdto, user: any) {
    const { comment, photoId: id } = commentdto;

    const photo = await this.photosService.getOnePhoto({ id });

    const comments = new Comment();
    comments.comment = comment;
    comments.photo = photo;
    comments.user = user;

    const rs = await this.commentsRepository.save(comments);
    return rs;
  }

  public async getAllCommentPhoto(getAllCommentPhoto: GetAllCommentPhoto) {
    const { photoId } = getAllCommentPhoto;

    const rs = await this.commentsRepository.findAndCount({
      where: { photoId },
    });
    return rs;
  }

  public async updateComment(
    updateCommentdto: UpdateCommentdto,
    userId: string,
  ) {
    const { updateComment, photoId } = updateCommentdto;

    const comments = await this.commentsRepository.findOne({
      where: { photoId, userId },
    });

    comments.comment = updateComment;

    const rs = await this.commentsRepository.save(comments);
    return rs;
  }

  public async deleteComment(
    deleteCommentdto: DeleteCommentdto,
    userId: string,
  ) {
    const { photoId } = deleteCommentdto;

    const comments = await this.commentsRepository.findOne({
      where: { photoId, userId },
    });

    const rs = await this.commentsRepository.remove(comments);
    return rs;
  }
}
