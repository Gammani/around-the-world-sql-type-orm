import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class GetCommentIdByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(GetCommentIdByIdCommand)
export class GetCommentIdByIdUseCase
  implements ICommandHandler<GetCommentIdByIdCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: GetCommentIdByIdCommand): Promise<string | null> {
    return await this.commentsRepository.findCommentId(command.commentId);
  }
}
