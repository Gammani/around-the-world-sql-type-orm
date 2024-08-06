import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class GetUserIdByCommentIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(GetUserIdByCommentIdCommand)
export class GetUserIdByCommentIdUseCase
  implements ICommandHandler<GetUserIdByCommentIdCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: GetUserIdByCommentIdCommand): Promise<string | null> {
    return await this.commentsRepository.findUserIdByCommentId(
      command.commentId,
    );
  }
}
