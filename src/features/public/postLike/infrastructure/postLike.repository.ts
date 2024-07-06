import { Injectable } from '@nestjs/common';
import {
  CreatedPostLikeDtoType,
  LikeStatus,
  PostLikeViewDbType,
} from '../../../types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostLikeEntity } from '../domain/postLike.entity';

@Injectable()
export class PostLikeRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(PostLikeEntity)
    private postLikesRepo: Repository<PostLikeEntity>,
  ) {}

  async findPostLike(
    postId: string,
    userId: string,
  ): Promise<PostLikeViewDbType | null> {
    const foundPostLike = await this.postLikesRepo.find({
      where: {
        postId: postId,
        userId: userId,
      },
    });
    if (foundPostLike.length > 0) {
      return {
        id: foundPostLike[0].id,
        userId: foundPostLike[0].userId,
        postId: foundPostLike[0].postId,
        likeStatus: foundPostLike[0].likeStatus,
        addedAt: foundPostLike[0].addedAt,
        lastUpdate: foundPostLike[0].lastUpdate,
      };
    } else {
      return null;
    }
  }

  async createPostLike(createdPostLikeDto: CreatedPostLikeDtoType) {
    await this.dataSource.query(
      `INSERT INTO public."PostLike"(
id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        createdPostLikeDto.id,
        createdPostLikeDto.userId,
        createdPostLikeDto.post.blogId,
        createdPostLikeDto.post.id,
        createdPostLikeDto.login,
        createdPostLikeDto.likeStatus,
        createdPostLikeDto.addedAt,
        createdPostLikeDto.lastUpdate,
      ],
    );
    return;
  }

  async save(entity: PostLikeEntity): Promise<string> {
    await entity.save();
    return entity.id;
  }

  async updatePostLikeStatus(
    likeStatus: LikeStatus,
    postLike: PostLikeViewDbType,
  ): Promise<boolean> {
    const date = new Date();
    const result = await this.postLikesRepo.update(
      {
        id: postLike.id,
      },
      {
        likeStatus: likeStatus,
        lastUpdate: date,
      },
    );
    return result.affected === 1;
  }

  //   async deletePostLikesByPostId(postId: string) {
  //     return await this.dataSource.query(
  //       `DELETE FROM public."PostLike"
  // WHERE "postId" = $1`,
  //       [postId],
  //     );
  //   }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."PostLike"`);
  }
}
