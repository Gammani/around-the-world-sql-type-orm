import { Injectable } from '@nestjs/common';
import {
  BlogViewModel,
  BlogWithPaginationViewModel,
} from '../api/models/output/blog.output.model';
import { validate as validateUUID } from 'uuid';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlogEntity } from '../domain/blogs.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepo: Repository<BlogEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findAllBlogs(
    searchNameTermQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
  ): Promise<BlogWithPaginationViewModel> {
    const searchNameTerm = searchNameTermQuery ? searchNameTermQuery : '';
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const offset = (pageNumber - 1) * pageSize;
    const validSortFields = [
      'id',
      'name',
      'description',
      'websiteUrl',
      'createdAt',
      'isMembership',
    ];
    const sortBy =
      sortByQuery && validSortFields.includes(sortByQuery)
        ? `"${sortByQuery}"`
        : `"createdAt"`;

    const sortDirection = sortDirectionQuery === 'asc' ? 'ASC' : 'DESC';

    //     const totalBlogs = await this.dataSource.query(
    //       `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
    // FROM public."Blogs"
    // WHERE LOWER(name) ILIKE '%${searchNameTerm}%'`,
    //       [],
    //     );
    const totalBlogs = await this.blogRepo
      .createQueryBuilder('blog')
      .where(`LOWER(blog.name) ILIKE :searchNameTerm`, {
        searchNameTerm: `%${searchNameTerm}%`,
      })
      .getMany();
    const totalCount = totalBlogs.length;

    //     const blogs = await this.dataSource.query(
    //       `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
    // FROM public."Blogs"
    // WHERE LOWER(name) ILIKE '%${searchNameTerm}%'
    // ORDER BY CASE WHEN name = UPPER(name) THEN 0 ELSE 1 END, ${sortBy} ${sortDirection}
    //   LIMIT $1 OFFSET $2`,
    //       [pageSize, offset],
    //     );
    const blogs = await this.blogRepo
      .createQueryBuilder('blog')
      .where(`LOWER(blog.name) ILIKE :searchNameTerm`, {
        searchNameTerm: `%${searchNameTerm}%`,
      })
      .orderBy(sortBy, sortDirection)
      .limit(pageSize)
      .offset(offset)
      .getMany();

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        websiteUrl: i.websiteUrl,
        createdAt: i.createdAt.toISOString(),
        isMembership: i.isMembership,
      })),
    };
  }

  async findBlogById(blogId: string): Promise<BlogViewModel | null> {
    if (validateUUID(blogId)) {
      const foundBlog = await this.dataSource.query(
        `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
FROM public."Blogs"
WHERE id = $1`,
        [blogId],
      );
      if (foundBlog.length > 0) {
        return foundBlog[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    if (validateUUID(blogId)) {
      const foundBlog = await this.blogRepo
        .createQueryBuilder('blog')
        .where('blog.id = :blogId', { blogId })
        .getOne();
      if (foundBlog) {
        return {
          id: foundBlog.id,
          name: foundBlog.name,
          description: foundBlog.description,
          websiteUrl: foundBlog.websiteUrl,
          createdAt: foundBlog.createdAt.toISOString(),
          isMembership: foundBlog.isMembership,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
