import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { PostsRepository } from '../../../public/posts/infrastructure/posts.repository';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  // async findBlogById(blogId: string): Promise<BlogDbType | null> {
  //   return await this.blogsRepository.findBlogById(blogId);
  // }

  async removeBlogByAdmin(blogId: string): Promise<boolean> {
    await this.postsRepository.deleteAllPostsByBlogId(blogId);
    return await this.blogsRepository.deleteBlog(blogId);
  }
}
