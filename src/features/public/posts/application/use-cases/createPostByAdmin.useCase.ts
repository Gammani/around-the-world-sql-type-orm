import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreatedPostDtoType,
  PostCreateModelWithBlogId,
} from '../../api/models/input/post.input.model';
import { PostViewModel } from '../../api/models/output/post.output.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogViewDbType } from '../../../../types';
import { v1 as uuidv1 } from 'uuid';

export class CreatePostByAdminCommand {
  constructor(
    public inputPostModel: PostCreateModelWithBlogId,
    public blog: BlogViewDbType,
  ) {}
}

@CommandHandler(CreatePostByAdminCommand)
export class CreatePostByAdminUseCase
  implements ICommandHandler<CreatePostByAdminCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: CreatePostByAdminCommand): Promise<PostViewModel> {
    const createdPost: CreatedPostDtoType = {
      id: uuidv1(),
      title: command.inputPostModel.title,
      shortDescription: command.inputPostModel.shortDescription,
      content: command.inputPostModel.content,
      blogId: command.inputPostModel.blogId,
      blogName: command.blog.name,
      createdAt: new Date(),
    };

    return await this.postsRepository.createPostByAdmin(createdPost);
  }
}
