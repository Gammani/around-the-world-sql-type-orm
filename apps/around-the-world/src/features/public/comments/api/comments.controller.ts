import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { CommentInputModel } from '../../posts/api/models/input/comment.input.model';
import {
  RequestWithDeviceId,
  RequestWithUserId,
} from '../../auth/api/models/input/auth.input.model';
import { CommentLikeModel } from './models/input/comment.like.model';
import { CommentLikeService } from '../../commentLike/appliacation/commentLike.service';
import { CommandBus } from '@nestjs/cqrs';
import { GetUserIdByCommentIdCommand } from '../application/use-cases/getUserIdByCommentIdUseCase';
import { GetQueryCommentByIdCommand } from '../application/use-cases/getQueryCommentById.useCase';
import { UpdateCommentCommand } from '../application/use-cases/updateComment.useCase';
import { DeleteCommentByIdCommand } from '../application/use-cases/deleteCommentById.useCase';
import { GetCommentLikeCommand } from '../../commentLike/appliacation/use-cases/getCommentLike.useCase';
import { UpdateCommentLikeCommand } from '../../commentLike/appliacation/use-cases/updateCommentLike.useCase';
import { CreateCommentLikeCommand } from '../../commentLike/appliacation/use-cases/createCommentLike.useCase';
import { CheckAccessToken } from '../../auth/guards/jwt-accessToken.guard';
import { UsersService } from '../../../super-admin/users/application/users.service';
import { CommentViewModelType } from '../../../../infrastructure/helpres/types';
import { GetUserIdByDeviceIdCommand } from '../../../super-admin/users/application/use-cases/getUserIdByDeviceIdUseCase';
import { GetCommentIdByIdCommand } from '../application/use-cases/getCommentIdByIdUseCase';
import { SwaggerGetCommentByIdEndpoint } from '../../../../swagger/comments/getCommentById';
import { SwaggerUpdateCommentByIdEndpoint } from '../../../../swagger/comments/updateCommentById';
import { SwaggerRemoveCommentByIdEndpoint } from '../../../../swagger/comments/removeCommentById';
import { SwaggerUpdateCommentLikeStatusEndpoint } from '../../../../swagger/comments/updateCommentLikeStatus';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentLikeService: CommentLikeService,
    private readonly userService: UsersService,
    private commandBus: CommandBus,
  ) {}

  @Get(':id')
  @SwaggerGetCommentByIdEndpoint()
  async getCommentById(
    @Param('id') commentId: string,
    @Req() req: Request & RequestWithUserId,
  ) {
    const foundComment: CommentViewModelType | null =
      await this.commandBus.execute(
        new GetQueryCommentByIdCommand(commentId, req.user?.userId),
      );
    if (foundComment) {
      return foundComment;
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckAccessToken)
  @Put(':commentId')
  @SwaggerUpdateCommentByIdEndpoint()
  @HttpCode(204)
  async updateCommentById(
    @Body() inputCommentModel: CommentInputModel,
    @Param('commentId') commentId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundUserIdByCommentId: string | null = await this.commandBus.execute(
      new GetUserIdByCommentIdCommand(commentId),
    );

    if (foundUserIdByCommentId) {
      const foundUserIdByDeviceId: string | null =
        await this.commandBus.execute(
          new GetUserIdByDeviceIdCommand(req.deviceId),
        );
      if (
        foundUserIdByCommentId &&
        foundUserIdByCommentId === foundUserIdByDeviceId
      ) {
        await this.commandBus.execute(
          new UpdateCommentCommand(commentId, inputCommentModel.content),
        );
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckAccessToken)
  @Delete(':commentId')
  @SwaggerRemoveCommentByIdEndpoint()
  @HttpCode(204)
  async removeCommentById(
    @Param('commentId') commentId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundUserIdByCommentId: string | null = await this.commandBus.execute(
      new GetUserIdByCommentIdCommand(commentId),
    );
    if (foundUserIdByCommentId) {
      const foundUserIdByDeviceId: string | null =
        await this.commandBus.execute(
          new GetUserIdByDeviceIdCommand(req.deviceId),
        );
      if (
        foundUserIdByDeviceId &&
        foundUserIdByDeviceId === foundUserIdByCommentId
      ) {
        await this.commandBus.execute(new DeleteCommentByIdCommand(commentId));
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckAccessToken)
  @Put(':commentId/like-status')
  @SwaggerUpdateCommentLikeStatusEndpoint()
  @HttpCode(204)
  async updateCommentLikeStatus(
    @Body() commentLikeModel: CommentLikeModel,
    @Param('commentId') commentId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundCommentId: string | null = await this.commandBus.execute(
      new GetCommentIdByIdCommand(commentId),
    );
    if (foundCommentId) {
      const foundUserIdByDeviceId: string | null =
        await this.commandBus.execute(
          new GetUserIdByDeviceIdCommand(req.deviceId),
        );
      if (foundUserIdByDeviceId) {
        const foundCommentLikeIdFromUser: string | null =
          await this.commandBus.execute(
            new GetCommentLikeCommand(foundCommentId, foundUserIdByDeviceId),
          );
        if (foundCommentLikeIdFromUser) {
          await this.commandBus.execute(
            new UpdateCommentLikeCommand(
              commentLikeModel.likeStatus,
              foundCommentLikeIdFromUser,
            ),
          );
        } else {
          await this.commandBus.execute(
            new CreateCommentLikeCommand(
              foundCommentId,
              commentLikeModel.likeStatus,
              foundUserIdByDeviceId,
            ),
          );
        }
      }
    } else {
      throw new NotFoundException();
    }
  }
}
