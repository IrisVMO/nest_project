import { CommentsService } from './comments.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Commentdto,
  UpdateCommentdto,
  DeleteCommentdto,
  GetAllCommentPhoto,
} from './comment.dto';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async createComment(
    @Body() commentdto: Commentdto,
    @Res() res,
    @Req() req,
  ) {
    const data = await this.commentsService.createComment(commentdto, req.user);

    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('allCommentInPhoto/:photoId')
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async getAllCommentPhoto(
    @Param() getAllCommentPhoto: GetAllCommentPhoto,
    @Res() res,
  ) {
    const data = await this.commentsService.getAllCommentPhoto(
      getAllCommentPhoto,
    );
    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async updateComent(
    @Body() updateCommentdto: UpdateCommentdto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const data = await this.commentsService.updateComment(
      updateCommentdto,
      userId,
    );

    res.json({ data });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async deleteComment(
    @Body() deleteCommentdto: DeleteCommentdto,
    @Res() res,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const data = await this.commentsService.deleteComment(
      deleteCommentdto,
      userId,
    );

    res.json({ data });
  }
}
