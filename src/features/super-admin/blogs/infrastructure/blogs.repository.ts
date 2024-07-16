import { Injectable } from '@nestjs/common';
import { BlogViewDbType } from '../../../../infrastructure/helpres/types';
import { BlogUpdateModel } from '../api/models/input/blog.input.model';
import { validate as validateUUID } from 'uuid';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogEntity } from '../domain/blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepo: Repository<BlogEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async save(entity: BlogEntity): Promise<string> {
    const result = await entity.save();
    return result.id;
  }
  async findBlogById(blogId: string): Promise<BlogViewDbType | null> {
    if (validateUUID(blogId)) {
      const foundBlog = await this.blogRepo
        .createQueryBuilder('blog')
        .where('blog.id = :blogId', { blogId })
        .getOne();
      if (foundBlog) {
        return foundBlog;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async updateBlogByAdmin(
    blogId: string,
    inputBlogModel: BlogUpdateModel,
  ): Promise<boolean> {
    const result = await this.blogRepo.update(
      { id: blogId },
      {
        name: inputBlogModel.name,
        description: inputBlogModel.description,
        websiteUrl: inputBlogModel.websiteUrl,
      },
    );
    return result.affected === 1;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const result = await this.blogRepo.delete({
      id: blogId,
    });
    return result.affected === 1;
  }

  async deleteAll() {
    await this.blogRepo.delete({});
  }
  // for tests
  async findBlogByName(blogName: string) {
    return this.dataSource.query(
      `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
FROM public."Blogs"
WHERE "name" = $1`,
      [blogName],
    );
  }
}
