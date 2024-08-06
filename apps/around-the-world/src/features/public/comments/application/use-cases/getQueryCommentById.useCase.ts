import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentViewModel } from '../../api/models/output/comment-output.model';
import { CommentsQueryRepository } from '../../infrastructure/comments.query.repository';

export class GetQueryCommentByIdCommand {
  constructor(
    public commentId: string,
    public userId?: string | null,
  ) {}
}

@CommandHandler(GetQueryCommentByIdCommand)
export class GetQueryCommentByIdUseCase
  implements ICommandHandler<GetQueryCommentByIdCommand>
{
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute(
    command: GetQueryCommentByIdCommand,
  ): Promise<CommentViewModel | null> {
    return await this.commentsQueryRepository.findCommentById(
      command.commentId,
      command.userId,
    );
  }
}
