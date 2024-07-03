import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogCreateModel } from '../../api/models/input/blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogEntity } from '../../domain/blogs.entity';

export class CreateBlogByAdminCommand {
  constructor(public inputBlogModel: BlogCreateModel) {}
}

@CommandHandler(CreateBlogByAdminCommand)
export class CreateBlogByAdminUseCase
  implements ICommandHandler<CreateBlogByAdminCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogByAdminCommand): Promise<string> {
    const createdBlogDto = new BlogEntity();
    createdBlogDto.name = command.inputBlogModel.name;
    createdBlogDto.description = command.inputBlogModel.description;
    createdBlogDto.websiteUrl = command.inputBlogModel.websiteUrl;

    return await this.blogsRepository.save(createdBlogDto);
  }
}
