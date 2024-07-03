import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputModel } from '../../../posts/api/models/input/comment.input.model';
import { CommentViewModel } from '../../api/models/output/comment-output.model';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { PostViewDbType, UserViewDbModelType } from '../../../../types';
import { CreatedCommentDtoType } from '../../api/models/input/comment.input.model';
import { v1 as uuidv1 } from 'uuid';

export class CreateCommentCommand {
  constructor(
    public inputCommentModel: CommentInputModel,
    public user: UserViewDbModelType,
    public post: PostViewDbType,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand): Promise<CommentViewModel> {
    const createdComment: CreatedCommentDtoType = {
      id: uuidv1(),
      content: command.inputCommentModel.content,
      createdAt: new Date(),
      userId: command.user.id,
      userLogin: command.user.accountData.login,
      postId: command.post.id,
      blogId: command.post.blogId,
    };
    return await this.commentsRepository.createComment(createdComment);
  }
}
