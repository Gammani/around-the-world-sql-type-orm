import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateModel } from '../../api/models/input/post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostEntity } from '../../domain/posts.entity';

export class CreatePostByAdminWithBlogIdCommand {
  constructor(
    public createInputPostModel: PostCreateModel,
    public blogId: string,
  ) {}
}

@CommandHandler(CreatePostByAdminWithBlogIdCommand)
export class CreatePostByAdminWithBlogIdUseCase
  implements ICommandHandler<CreatePostByAdminWithBlogIdCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: CreatePostByAdminWithBlogIdCommand) {
    const createdPostDto = new PostEntity();
    createdPostDto.title = command.createInputPostModel.title;
    createdPostDto.shortDescription =
      command.createInputPostModel.shortDescription;
    createdPostDto.content = command.createInputPostModel.content;
    createdPostDto.blogId = command.blogId;
    createdPostDto.createdAt = new Date();

    return await this.postsRepository.save(createdPostDto);
  }
}
