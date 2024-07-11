import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikeRepository } from '../../infrastructure/commentLike.repository';
import { LikeStatus } from '../../../../types';

export class UpdateCommentLikeCommand {
  constructor(
    public likeStatus: LikeStatus,
    public commentLikeId: string,
  ) {}
}

@CommandHandler(UpdateCommentLikeCommand)
export class UpdateCommentLikeUseCase
  implements ICommandHandler<UpdateCommentLikeCommand>
{
  constructor(private commentLikeRepository: CommentLikeRepository) {}

  async execute(command: UpdateCommentLikeCommand) {
    return await this.commentLikeRepository.updateLikeStatus(
      command.likeStatus,
      command.commentLikeId,
    );
  }
}
