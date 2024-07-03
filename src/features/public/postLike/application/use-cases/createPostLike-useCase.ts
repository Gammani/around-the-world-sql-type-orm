import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';
import {
  LikeStatus,
  PostViewDbType,
  UserViewDbModelType,
} from '../../../../types';
import { PostLikeEntity } from '../../domain/postLike.entity';

export class CreatePostLikeCommand {
  constructor(
    public user: UserViewDbModelType,
    public post: PostViewDbType,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(CreatePostLikeCommand)
export class CreatePostLikeUseCase
  implements ICommandHandler<CreatePostLikeCommand>
{
  constructor(private postLikeRepository: PostLikeRepository) {}

  async execute(command: CreatePostLikeCommand) {
    const date = new Date();
    const createdPostLikeDto = new PostLikeEntity();
    createdPostLikeDto.userId = command.user.id;
    createdPostLikeDto.postId = command.post.id;
    createdPostLikeDto.likeStatus = command.likeStatus;
    createdPostLikeDto.addedAt = date;
    createdPostLikeDto.lastUpdate = date;
    createdPostLikeDto.blogId = command.post.blogId;
    return await this.postLikeRepository.save(createdPostLikeDto);
  }
}
