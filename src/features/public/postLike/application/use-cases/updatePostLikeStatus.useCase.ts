import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';
import { LikeStatus, PostLikeViewDbType } from '../../../../types';

export class UpdatePostLikeStatusCommand {
  constructor(
    public likeStatus: LikeStatus,
    public postLike: PostLikeViewDbType,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler {
  constructor(private postLikeRepository: PostLikeRepository) {}

  async execute(command: UpdatePostLikeStatusCommand) {
    return await this.postLikeRepository.updatePostLikeStatus(
      command.likeStatus,
      command.postLike,
    );
  }
}
