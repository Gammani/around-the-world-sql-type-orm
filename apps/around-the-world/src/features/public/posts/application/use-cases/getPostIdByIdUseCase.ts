import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class GetPostIdByIdCommand {
  constructor(public postId: string) {}
}

@CommandHandler(GetPostIdByIdCommand)
export class GetPostIdByIdUseCase
  implements ICommandHandler<GetPostIdByIdCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: GetPostIdByIdCommand): Promise<string | null> {
    return await this.postsRepository.findPostIdById(command.postId);
  }
}
