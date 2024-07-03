import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikeRepository } from '../../infrastructure/commentLike.repository';
import {
  CommentViewDbType,
  CreateCommentLikeDtoType,
  LikeStatus,
} from '../../../../types';
import { v1 as uuidv1 } from 'uuid';

export class CreateCommentLikeCommand {
  constructor(
    public comment: CommentViewDbType,
    public likeStatus: LikeStatus,
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(CreateCommentLikeCommand)
export class CreateCommentLikeUseCase
  implements ICommandHandler<CreateCommentLikeCommand>
{
  constructor(private commentLikeRepository: CommentLikeRepository) {}

  async execute(command: CreateCommentLikeCommand) {
    const createCommentPostLike: CreateCommentLikeDtoType = {
      id: uuidv1(),
      userId: command.userId,
      login: command.userLogin,
      blogId: command.comment.blogId,
      postId: command.comment.postId,
      commentId: command.comment.id,
      likeStatus: command.likeStatus,
      addedAt: new Date(),
      lastUpdate: new Date(),
    };

    return await this.commentLikeRepository.createCommentLike(
      createCommentPostLike,
    );
  }
}
