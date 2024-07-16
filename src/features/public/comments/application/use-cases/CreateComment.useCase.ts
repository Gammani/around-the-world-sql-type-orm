import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputModel } from '../../../posts/api/models/input/comment.input.model';
import { CommentViewModel } from '../../api/models/output/comment-output.model';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import {
  PostViewDbType,
  UserViewDbModelType,
} from '../../../../../infrastructure/helpres/types';
import { CreatedCommentDtoType } from '../../api/models/input/comment.input.model';
import { v1 as uuidv1 } from 'uuid';
import { CommentEntity } from '../../domain/comments.entity';

export class CreateCommentCommand {
  constructor(
    public inputCommentModel: CommentInputModel,
    public userId: string,
    public postId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const createdComment = new CommentEntity();
    createdComment.content = command.inputCommentModel.content;
    createdComment.createdAt = new Date();
    createdComment.userId = command.userId;
    createdComment.postId = command.postId;
    return await this.commentsRepository.save(createdComment);
  }
}
