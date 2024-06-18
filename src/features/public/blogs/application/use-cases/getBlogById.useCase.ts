import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogViewDbType } from '../../../../types';
import { BlogsRepository } from '../../../../super-admin/blogs/infrastructure/blogs.repository';

export class GetBlogByIdCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(GetBlogByIdCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: GetBlogByIdCommand): Promise<BlogViewDbType | null> {
    return await this.blogsRepository.findBlogById(command.blogId);
  }
}
