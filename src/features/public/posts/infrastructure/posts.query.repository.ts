import { Injectable } from '@nestjs/common';
import {
  PostsWithPaginationViewModel,
  PostViewModel,
} from '../api/models/output/post.output.model';
import { LikeStatus } from '../../../types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from '../domain/posts.entity';
import { PostLikeEntity } from '../../postLike/domain/postLike.entity';
import { PaginationViewModel } from '../../../../infrastructure/helpres/pagination.view.mapper';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private postLikesRepo: Repository<PostLikeEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findPosts(
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    userId?: string | null | undefined,
    blogId?: string,
  ): Promise<PostsWithPaginationViewModel | any> {
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const validSortFields = [
      'id',
      'title',
      'shortDescription',
      'content',
      'blogId',
      'blogName',
      'createdAt',
    ];
    const sortBy =
      sortByQuery && validSortFields.includes(sortByQuery)
        ? `${sortByQuery}`
        : `"createdAt"`;
    // const sortBy = sortByQuery === '' ? `${sortByQuery}` : 'createdAt';
    const sortDirection = sortDirectionQuery === 'asc' ? 'ASC' : 'DESC';

    const offset = (pageNumber - 1) * pageSize;

    let totalCount;
    let items;

    if (blogId) {
      items = await this.postRepo
        .createQueryBuilder('p')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)')
            .from(PostLikeEntity, 'like')
            .where(`like.likeStatus = '${LikeStatus.Like}'`)
            .andWhere('like.postId = p.id');
        }, 'likesCount')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)')
            .from(PostLikeEntity, 'dislike')
            .where(`dislike.likeStatus = '${LikeStatus.Dislike}'`)
            .andWhere('dislike.postId = p.id');
        }, 'dislikesCount')
        .addSelect((subQuery) => {
          return subQuery
            .select('status.likeStatus')
            .from(PostLikeEntity, 'status')
            .where('status.userId = :userId', { userId })
            .andWhere('status.postId = p.id');
        }, 'myStatus')
        .addSelect((subQuery) => {
          return subQuery
            .select(
              `jsonb_agg(json_build_object('addedAt', agg."createdAt", 'userId', cast(agg."userId" as varchar), 'login', agg.login))`,
            )
            .from((subQuery) => {
              return subQuery
                .select(`"createdAt", "userId", "login"`)
                .from(PostLikeEntity, 'postLike')
                .leftJoin('postLike.user', 'user')
                .where('postLike.postId = p.id')
                .andWhere('postLike.likeStatus = :likeStatus', {
                  likeStatus: LikeStatus.Like,
                })
                .orderBy('"addedAt"', 'DESC')
                .limit(3);
            }, 'agg');
        }, 'newestLikes')
        .leftJoinAndSelect('p.blog', 'blog')
        .where('p.blogId = :blogId', { blogId })
        .orderBy(
          `${sortBy}` === 'blogName' ? `blog.name` : `p.${sortBy}`,
          sortDirection,
        )
        .offset(offset)
        .limit(pageSize)
        .getRawMany();

      totalCount = await this.postRepo
        .createQueryBuilder('p')
        .where('p.blogId = :blogId', { blogId })
        .getCount();
    } else {
      items = await this.postRepo
        .createQueryBuilder('p')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)')
            .from(PostLikeEntity, 'like')
            .where(`like.likeStatus = '${LikeStatus.Like}'`)
            .andWhere('like.postId = p.id');
        }, 'likesCount')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)')
            .from(PostLikeEntity, 'dislike')
            .where(`dislike.likeStatus = '${LikeStatus.Dislike}'`)
            .andWhere('dislike.postId = p.id');
        }, 'dislikesCount')
        .addSelect((subQuery) => {
          return subQuery
            .select('status.likeStatus')
            .from(PostLikeEntity, 'status')
            .where('status.userId = :userId', { userId })
            .andWhere('status.postId = p.id');
        }, 'myStatus')
        .addSelect((subQuery) => {
          return subQuery
            .select(
              `jsonb_agg(json_build_object('addedAt', agg."createdAt", 'userId', cast(agg."userId" as varchar), 'login', agg.login))`,
            )
            .from((subQuery) => {
              return subQuery
                .select(`"createdAt", "userId", "login"`)
                .from(PostLikeEntity, 'postLike')
                .leftJoin('postLike.user', 'user')
                .where('postLike.postId = p.id')
                .andWhere('postLike.likeStatus = :likeStatus', {
                  likeStatus: LikeStatus.Like,
                })
                .orderBy('"addedAt"', 'DESC')
                .limit(3);
            }, 'agg');
        }, 'newestLikes')
        .leftJoinAndSelect('p.blog', 'blog')
        .orderBy(
          `${sortBy}` === 'blogName' ? `blog.name` : `p.${sortBy}`,
          sortDirection,
        )
        .offset(offset)
        .limit(pageSize)
        .getRawMany();

      totalCount = await this.postRepo.createQueryBuilder().getCount();
    }

    return new PaginationViewModel(
      totalCount,
      pageNumber,
      pageSize,
      await this.getPostItemsViewModel(items),
    );
  }
  async findPostById(
    postId: string,
    userId?: string | null | undefined,
  ): Promise<PostViewModel | null> {
    if (validateUUID(postId)) {
      const foundPost = await this.postRepo.find({
        relations: {
          blog: true,
        },
        where: { id: postId },
      });

      const foundLikes = await this.postLikesRepo.find({
        relations: {
          user: true,
          post: true,
        },
        where: {
          post: {
            id: postId,
          },
        },
        order: {
          addedAt: 'DESC',
        },
      });

      const likes = foundLikes.filter((like) => like.likeStatus === 'Like');
      const dislike = foundLikes.filter(
        (dislike) => dislike.likeStatus === 'Dislike',
      );
      const myStatus = foundLikes.filter((status) => status.userId === userId);

      const newWestLikes = likes.slice(0, 3).map((like) => {
        return {
          addedAt: like.addedAt.toISOString(),
          userId: like.userId,
          login: like.user.login,
        };
      });

      if (foundPost.length > 0) {
        return {
          id: foundPost[0].id,
          title: foundPost[0].title,
          shortDescription: foundPost[0].shortDescription,
          content: foundPost[0].content,
          blogId: foundPost[0].blogId,
          blogName: foundPost[0].blog.name,
          createdAt: foundPost[0].createdAt.toISOString(),
          extendedLikesInfo: {
            likesCount: likes.length,
            dislikesCount: dislike.length,
            myStatus:
              myStatus.length > 0 ? myStatus[0].likeStatus : LikeStatus.None,
            newestLikes: newWestLikes,
          },
        };
      }
      return null;
    } else {
      return null;
    }
  }

  async getPostItemsViewModel(items: any[]): Promise<PostViewModel[]> {
    return items.map((i) => {
      return {
        id: i.p_id,
        title: i.p_title,
        shortDescription: i.p_shortDescription,
        content: i.p_content,
        blogId: i.p_blogId,
        blogName: i.blog_name,
        createdAt: i.p_createdAt.toISOString(),
        extendedLikesInfo: {
          likesCount: +i.likesCount,
          dislikesCount: +i.dislikesCount,
          myStatus: i.myStatus || 'None',
          newestLikes: i.newestLikes || [],
        },
      };
    });
  }
}

const writeSql = async (sql: string) => {
  // eslint-disable-next-line
  const fs = require('fs/promises');
  try {
    await fs.writeFile('sql.txt', sql);
  } catch (error) {
    console.log(error);
  }
};
