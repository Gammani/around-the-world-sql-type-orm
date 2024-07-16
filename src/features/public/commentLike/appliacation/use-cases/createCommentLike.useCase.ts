import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikeRepository } from '../../infrastructure/commentLike.repository';
import { LikeStatus } from '../../../../../infrastructure/helpres/types';
import { CommentLikeEntity } from '../../domain/commentLike.entity';

export class CreateCommentLikeCommand {
  constructor(
    public commentId: string,
    public likeStatus: LikeStatus,
    public userId: string,
  ) {}
}

@CommandHandler(CreateCommentLikeCommand)
export class CreateCommentLikeUseCase
  implements ICommandHandler<CreateCommentLikeCommand>
{
  constructor(private commentLikeRepository: CommentLikeRepository) {}

  async execute(command: CreateCommentLikeCommand) {
    const createCommentPostLike = new CommentLikeEntity();
    const date = new Date();
    createCommentPostLike.userId = command.userId;
    createCommentPostLike.commentId = command.commentId;
    createCommentPostLike.likeStatus = command.likeStatus;
    createCommentPostLike.addedAt = date;
    createCommentPostLike.lastUpdate = date;

    return await this.commentLikeRepository.save(createCommentPostLike);
  }
}
