import { Injectable } from '@nestjs/common';
import { CommentViewModel } from '../api/models/output/comment-output.model';
import { LikeStatus } from '../../../../infrastructure/helpres/types';
import { CreatedCommentDtoType } from '../api/models/input/comment.input.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { CommentEntity } from '../domain/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  async findUserIdByCommentId(commentId: string): Promise<string | null> {
    if (validateUUID(commentId)) {
      const foundComment = await this.commentRepo.find({
        where: {
          id: commentId,
        },
      });
      if (foundComment.length > 0) {
        return foundComment[0].userId;
      } else {
        return null;
      }
    }
    return null;
  }
  async findCommentId(commentId: string): Promise<string | null> {
    if (validateUUID(commentId)) {
      const foundComment = await this.commentRepo.find({
        where: {
          id: commentId,
        },
      });
      if (foundComment.length > 0) {
        return foundComment[0].id;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async save(entity: CommentEntity): Promise<string> {
    const result = await entity.save();
    return result.id;
  }

  // async findCommentByPostId(postId: string) {
  //   return this.CommentModel.findOne({ _postId: postId });
  // }
  // async findCommentByContent(content: string) {
  //   return this.CommentModel.findOne({ content: content });
  // }
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const result = await this.commentRepo
      .createQueryBuilder()
      .update()
      .set({
        content: content,
      })
      .where(`id = :commentId`, { commentId })
      .execute();
    return result.affected === 1;
  }
  async deleteComment(commentId: string): Promise<boolean> {
    //     return await this.dataSource.query(
    //       `DELETE FROM public."Comments"
    // WHERE id = $1`,
    //       [commentId],
    //     );
    const result = await this.commentRepo
      .createQueryBuilder()
      .delete()
      .where('id = :commentId', { commentId })
      .execute();
    return result.affected === 1;
  }
  async deleteAll() {
    return await this.commentRepo.delete({});
  }
}
