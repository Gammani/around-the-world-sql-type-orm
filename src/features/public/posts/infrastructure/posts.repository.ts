import { Injectable } from '@nestjs/common';
import { PostViewModel } from '../api/models/output/post.output.model';
import {
  CreatedPostDtoType,
  UpdateInputPostModelType,
} from '../api/models/input/post.input.model';
import { LikeStatus, PostViewDbType } from '../../../types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { PostEntity } from '../domain/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
  ) {}

  async findPostById(postId: string): Promise<PostViewDbType | null> {
    if (validateUUID(postId)) {
      const foundPost = await this.postRepo.find({
        where: {
          id: postId,
        },
      });
      if (foundPost.length > 0) {
        return foundPost[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async createPostByAdmin(
    createdPostDto: CreatedPostDtoType,
  ): Promise<PostViewModel> {
    await this.dataSource.query(
      `INSERT INTO public."posts"(
  id, title, "shortDescription", content, "blogId", "blogName", "createdAt")
  VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        createdPostDto.id,
        createdPostDto.title,
        createdPostDto.shortDescription,
        createdPostDto.content,
        createdPostDto.blogId,
        createdPostDto.createdAt,
      ],
    );

    return {
      id: createdPostDto.id,
      title: createdPostDto.title,
      shortDescription: createdPostDto.shortDescription,
      content: createdPostDto.content,
      blogId: createdPostDto.blogId,
      blogName: createdPostDto.blogName,
      createdAt: createdPostDto.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }

  async save(entity: PostEntity): Promise<string> {
    const result = await entity.save();
    return result.id;
  }

  async updatePostByAdmin(
    postId: string,
    blogId: string,
    inputPostModel: UpdateInputPostModelType,
  ): Promise<boolean> {
    const result = await this.postRepo
      .createQueryBuilder()
      .update()
      .set({
        title: inputPostModel.title,
        shortDescription: inputPostModel.shortDescription,
        content: inputPostModel.content,
        blogId: blogId,
      })
      .where(`id = :postId`, { postId })
      .execute();
    return result.affected === 1;
  }

  async deletePostById(postId: string): Promise<boolean> {
    const result = await this.postRepo
      .createQueryBuilder()
      .delete()
      .from('posts')
      .where('id = :postId', { postId })
      .execute();
    return result.affected === 1;
  }

  async deleteAllPostsByBlogId(blogId: string) {
    await this.dataSource.query(
      `DELETE FROM public."Posts"
  WHERE "blogId" = $1`,
      [blogId],
    );
    return;
  }

  async deleteAll() {
    await this.postRepo.delete({});
  }

  // for tests
  async findPostByTitle(postTitle: string) {
    return this.dataSource.query(
      `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
FROM public."Posts"
WHERE "title" = $1`,
      [postTitle],
    );
  }
}
