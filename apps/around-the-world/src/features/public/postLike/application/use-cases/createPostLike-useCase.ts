import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';
import { LikeStatus } from '../../../../../infrastructure/helpres/types';
import { PostLikeEntity } from '../../domain/postLike.entity';

export class CreatePostLikeCommand {
  constructor(
    public userId: string,
    public postId: string,
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
    createdPostLikeDto.userId = command.userId;
    createdPostLikeDto.postId = command.postId;
    createdPostLikeDto.likeStatus = command.likeStatus;
    createdPostLikeDto.addedAt = date;
    createdPostLikeDto.lastUpdate = date;
    return await this.postLikeRepository.save(createdPostLikeDto);
  }
}
