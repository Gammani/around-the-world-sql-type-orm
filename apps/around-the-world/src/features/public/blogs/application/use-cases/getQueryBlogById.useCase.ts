import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../../super-admin/blogs/infrastructure/blogs.query.repository';

export class GetQueryBlogByIdCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(GetQueryBlogByIdCommand)
export class GetQueryBlogByIdUseCase
  implements ICommandHandler<GetQueryBlogByIdCommand>
{
  constructor(private blogQueryRepository: BlogsQueryRepository) {}

  async execute(command: GetQueryBlogByIdCommand) {
    return await this.blogQueryRepository.getBlogById(command.blogId);
  }
}
