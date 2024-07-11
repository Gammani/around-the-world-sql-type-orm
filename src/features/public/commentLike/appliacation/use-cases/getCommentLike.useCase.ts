import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikeRepository } from '../../infrastructure/commentLike.repository';
import { CommentLikeDbType, CommentLikeViewDbType } from '../../../../types';

export class GetCommentLikeCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(GetCommentLikeCommand)
export class GetCommentLikeUseCase
  implements ICommandHandler<GetCommentLikeCommand>
{
  constructor(private commentLikeRepository: CommentLikeRepository) {}

  async execute(command: GetCommentLikeCommand): Promise<string | null> {
    const foundCommentLikeId: string | null =
      await this.commentLikeRepository.findLike(
        command.commentId,
        command.userId,
      );
    if (foundCommentLikeId) {
      return foundCommentLikeId;
    } else {
      return null;
    }
  }
}
