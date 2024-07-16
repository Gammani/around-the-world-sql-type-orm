import { Injectable } from '@nestjs/common';
import {
  CommentsWithPaginationViewModel,
  CommentViewModel,
} from '../api/models/output/comment-output.model';
import {
  CommentViewModelType,
  LikeStatus,
} from '../../../../infrastructure/helpres/types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentEntity } from '../domain/comments.entity';
import { CommentLikeEntity } from '../../commentLike/domain/commentLike.entity';
import { validate as validateUUID } from 'uuid';
import { PaginationViewModel } from '../../../../infrastructure/helpres/pagination.view.mapper';
import { sortedParamOptions } from '../../../../infrastructure/helpres/helpers';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findCommentById(
    commentId: string,
    userId?: string | null,
  ): Promise<CommentViewModel | null> {
    if (validateUUID(commentId)) {
      const foundComment = await this.commentRepo
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.user', 'user')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)')
            .from(CommentLikeEntity, 'like')
            .where(`like.likeStatus = '${LikeStatus.Like}'`)
            .andWhere('like.commentId = c.id');
        }, 'likesCount')
        .addSelect((subQuery) => {
          return subQuery
            .select('count(*)')
            .from(CommentLikeEntity, 'dislike')
            .where(`dislike.likeStatus = '${LikeStatus.Dislike}'`)
            .andWhere('dislike.commentId = c.id');
        }, 'dislikesCount')
        .addSelect((subQuery) => {
          return subQuery
            .select('status.likeStatus')
            .from(CommentLikeEntity, 'status')
            .where('status.userId = :userId', { userId })
            .andWhere('status.commentId = c.id');
        }, 'myStatus')
        .where('c.id = :commentId', { commentId })
        .getRawOne();
      if (foundComment) {
        return {
          id: foundComment.c_id,
          content: foundComment.c_content,
          commentatorInfo: {
            userId: foundComment.user_id,
            userLogin: foundComment.user_login,
          },
          createdAt: foundComment.c_createdAt.toISOString(),
          likesInfo: {
            likesCount: +foundComment.likesCount,
            dislikesCount: +foundComment.dislikesCount,
            myStatus: foundComment.myStatus || LikeStatus.None,
          },
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async findComments(
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    postId: string,
    userId?: string | null | undefined,
  ): Promise<CommentsWithPaginationViewModel | any> {
    const sortedOptions = sortedParamOptions(
      pageNumberQuery,
      pageSizeQuery,
      ['content', 'createdAt'],
      sortByQuery,
      sortDirectionQuery,
    );

    const items = await this.commentRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user')
      .addSelect((subQuery) => {
        return subQuery
          .select('count(*)')
          .from(CommentLikeEntity, 'like')
          .where(`like.likeStatus = '${LikeStatus.Like}'`)
          .andWhere('like.commentId = c.id');
      }, 'likesCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('count(*)')
          .from(CommentLikeEntity, 'dislike')
          .where(`dislike.likeStatus = '${LikeStatus.Dislike}'`)
          .andWhere('dislike.commentId = c.id');
      }, 'dislikesCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('status.likeStatus')
          .from(CommentLikeEntity, 'status')
          .where('status.userId = :userId', { userId })
          .andWhere('status.commentId = c.id');
      }, 'myStatus')
      .leftJoinAndSelect('c.post', 'post')
      .where('c.postId = :postId', { postId })
      .orderBy(`c.${sortedOptions.sortBy}`, sortedOptions.sortDirection)
      .offset(sortedOptions.offset)
      .limit(sortedOptions.pageSize)
      .getRawMany();

    const totalCount = await this.commentRepo
      .createQueryBuilder('c')
      .where('c.postId = :postId', { postId })
      .getCount();
    return new PaginationViewModel(
      totalCount,
      sortedOptions.pageNumber,
      sortedOptions.pageSize,
      await this.getCommentItemsViewModel(items),
    );
  }

  async getCommentItemsViewModel(
    items: any[],
  ): Promise<CommentViewModelType[]> {
    return items.map((i) => {
      return {
        id: i.c_id,
        content: i.c_content,
        commentatorInfo: {
          userId: i.user_id,
          userLogin: i.user_login,
        },
        createdAt: i.c_createdAt.toISOString(),
        likesInfo: {
          likesCount: +i.likesCount,
          dislikesCount: +i.dislikesCount,
          myStatus: i.myStatus || LikeStatus.None,
        },
      };
    });
  }
}
