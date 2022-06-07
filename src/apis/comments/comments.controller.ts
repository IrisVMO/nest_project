import { CommentsService } from './comments.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CommentDto,
  UpdateCommentDto,
  DeleteCommentDto,
  GetAllCommentPhotoDto,
  GetAllCommentPhotoPageDto,
} from './comments.dto';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async createComment(
    @Body() commentDto: CommentDto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.commentsService.createComment(commentDto, userId);

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allCommentInPhoto/:photoId')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getAllCommentPhoto(
    @Param() getAllCommentPhoto: GetAllCommentPhotoDto,
    @Query() getAllCommentPhotoPageDto: GetAllCommentPhotoPageDto,
    @Res() res,
  ) {
    try {
      const data = await this.commentsService.getAllCommentPhoto(
        getAllCommentPhoto,
        getAllCommentPhotoPageDto,
      );
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async updateComent(
    @Body() updateCommentDto: UpdateCommentDto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    try {
      const data = await this.commentsService.updateComment(
        updateCommentDto,
        userId,
      );

      res.json({ data });
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async deleteComment(
    @Param() deleteCommentDto: DeleteCommentDto,
    @Res() res,
  ) {
    try {
      const data = await this.commentsService.deleteComment(deleteCommentDto);
      res.json({ data });
    } catch (error) {
      throw error;
    }
  }
}
