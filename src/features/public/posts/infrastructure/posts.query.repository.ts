import { Injectable } from '@nestjs/common';
import {
  customFilteredPostLikesType,
  PostsWithPaginationViewModel,
  PostViewModel,
} from '../api/models/output/post.output.model';
import { LikeStatus, PostLikeViewDbType, PostViewDbType } from '../../../types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from '../domain/posts.entity';
import { PostLikeEntity } from '../../postLike/domain/postLike.entity';

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
    // const sortBy =
    //   sortByQuery && validSortFields.includes(sortByQuery)
    //     ? `${sortByQuery}`
    //     : `createdAt`;
    const sortBy = sortByQuery === '' ? `${sortByQuery}` : 'createdAt';
    const sortDirection = sortDirectionQuery === 'asc' ? 'ASC' : 'DESC';

    const offset = (pageNumber - 1) * pageSize;
    let totalCount;
    let pageCount;

    let items: PostViewDbType[];

    if (blogId) {
      totalCount = await this.postRepo.find({
        relations: {
          blog: true,
        },
        where: {
          blogId: blogId,
        },
      });
      // console.log('totalCount = ', totalCount);

      const foundLikes = await this.postLikesRepo.find({
        relations: {
          user: true,
          post: true,
          blog: true,
        },
        where: {
          blog: { id: blogId },
        },
      });
      const foundPosts = await this.postRepo
        .createQueryBuilder('p')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)::int')
            .from(PostLikeEntity, 'l')
            .where('l.likeStatus = :likeStatus', {
              likeStatus: LikeStatus.Like,
            })
            .andWhere('l.postId = p.id');
        }, 'likesCount')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)::int')
            .from(PostLikeEntity, 'l')
            .where('l.likeStatus = :likeStatus', {
              likeStatus: LikeStatus.Dislike,
            })
            .andWhere('l.postId = p.id');
        }, 'dislikesCount')
        .addSelect((subQuery) => {
          return (
            subQuery
              .select(`l."likeStatus"`)
              // .select(`COALESCE( l."likeStatus",'${'None'}')`)
              .from(PostLikeEntity, 'l')
              .where('l.userId = :userId', {
                userId,
              })
              .andWhere('l.postId = p.id')
          );
        }, 'myStatus')
        .addSelect((subQuery) => {
          return (
            subQuery
              .select('l.id')
              // .select(`COALESCE( l."likeStatus",'${'None'}')`)
              .from(PostLikeEntity, 'l')
              .where('l.postId = p.id')
              .orderBy(`l."addedAt"`, 'DESC')
              .limit(1)
          );
        }, 'newestLikes')

        .where('p.blogId = :blogId', { blogId })
        .getRawMany();

      const items = totalCount.map((count) => {
        const likesData = foundLikes.find((like) => like.postId === count.id);
        return { ...count, likes: likesData };
      });
      console.log(foundPosts, ' foundPosts');
      // totalCount = await this.postLikesRepo.find({
      //   relations: {
      //     user: true,
      //     post: true,
      //     blog: true,
      //   },
      //   where: { blogId: blogId },
      //   order: {
      //     post: {
      //       [sortBy]: sortDirection,
      //     },
      //   },
      // });
      // console.log(totalCount);
      return items;
    } else {
      totalCount = await this.postRepo.find({});
    }

    return;

    //     if (blogId) {
    //       totalCount = await this.dataSource.query(
    //         `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
    // FROM public."Posts"
    // WHERE "blogId" = $1`,
    //         [blogId],
    //       );
    //       pageCount = Math.ceil(totalCount.length / pageSize);
    //       items = await this.dataSource.query(
    //         `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
    // FROM public."Posts"
    // WHERE "blogId" = $1
    // ORDER BY ${sortBy} ${sortDirection}
    //   LIMIT $2 OFFSET $3`,
    //         [blogId, pageSize, offset],
    //       );
    //     } else {
    //       totalCount = await this.dataSource
    //         .query(`SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
    // FROM public."Posts"`);
    //       pageCount = Math.ceil(totalCount.length / pageSize);
    //       items = await this.dataSource.query(
    //         `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
    //       FROM public."Posts"
    //       ORDER BY ${sortBy} ${sortDirection}
    //         LIMIT $1 OFFSET $2`,
    //         [pageSize, offset],
    //       );
    //     }
    //     const result = await Promise.all(
    //       items.map((item) => this.getExtendedLikesInfo(item, userId)),
    //     );
    //     const filteredResult = result.filter(
    //       (r) => r !== undefined,
    //     ) as customFilteredPostLikesType[];

    // return {
    // pagesCount: pageCount,
    // page: pageNumber,
    // pageSize: pageSize,
    // totalCount: totalCount.length,
    // items: filteredResult.map((r) => ({
    //   id: r.id.toString(),
    //   title: r.title,
    //   shortDescription: r.shortDescription,
    //   content: r.content,
    //   blogId: r.blogId,
    //   blogName: r.blogName,
    //   createdAt: r.createdAt,
    //   extendedLikesInfo: {
    //     likesCount: r.extendedLikesInfo.likesCount,
    //     dislikesCount: r.extendedLikesInfo.dislikesCount,
    //     myStatus: r.extendedLikesInfo.myStatus,
    //     newestLikes: r.extendedLikesInfo.newestLikes,
    // },
    // })),
    // };
  }

  //   async getExtendedLikesInfo(
  //     post: PostViewDbType,
  //     userId?: string | null | undefined,
  //   ): Promise<customFilteredPostLikesType | undefined> {
  //     try {
  //       let myStatus: PostLikeViewDbType | null = null;
  //       if (userId) {
  //         myStatus = await this.dataSource.query(
  //           `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
  // FROM public."postLike"
  // WHERE "postId"=$1 AND "userId"=$2`,
  //           [post.id, userId],
  //         );
  //       }
  //       const newestLikes: PostLikeViewDbType[] = await this.dataSource.query(
  //         `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
  // FROM public."postLike"
  // WHERE "postId" = $1 AND "likeStatus" = $2
  // ORDER BY "addedAt" DESC, id DESC
  // LIMIT 3;`,
  //         [post.id, LikeStatus.Like],
  //       );
  //       const likes: PostLikeViewDbType[] = await this.dataSource.query(
  //         `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
  // FROM public."PostLike"
  // WHERE "postId" = $1 AND "likeStatus" = $2`,
  //         [post.id, LikeStatus.Like],
  //       );
  //       const likesCount = likes.length;
  //
  //       const dislikes: PostLikeViewDbType[] = await this.dataSource.query(
  //         `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
  // FROM public."PostLike"
  // WHERE "postId" = $1 AND "likeStatus" = $2`,
  //         [post.id, LikeStatus.Dislike],
  //       );
  //       const dislikesCount = dislikes.length;
  //
  //       const newestLikesInfo = newestLikes.map((nl: PostLikeViewDbType) => ({
  //         addedAt: nl.addedAt.toISOString(),
  //         userId: nl.userId,
  //         login: nl.login,
  //       }));
  //
  //       return {
  //         id: post.id,
  //         title: post.title,
  //         shortDescription: post.shortDescription,
  //         content: post.content,
  //         blogId: post.blogId.toString(),
  //         blogName: post.blogName,
  //         createdAt: post.createdAt,
  //         extendedLikesInfo: {
  //           likesCount: likesCount,
  //           dislikesCount: dislikesCount,
  //           myStatus: myStatus?.[0] ? myStatus[0].likeStatus : LikeStatus.None,
  //           newestLikes: newestLikesInfo,
  //         },
  //       };
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  async findPostById(
    postId: string,
    userId?: string | null | undefined,
  ): Promise<PostViewModel | null | any> {
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
        likeStatus: 'DESC',
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
        createdAt: foundPost[0].createdAt,
        extendedLikesInfo: {
          likesCount: likes.length,
          dislikesCount: dislike.length,
          myStatus: myStatus.length > 0 ? myStatus[0].likeStatus : 'None',
          newestLikes: newWestLikes,
        },
      };
    }
    return;
  }
}
