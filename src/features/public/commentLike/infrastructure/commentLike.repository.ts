import { Injectable } from '@nestjs/common';
import {
  CommentLikeViewDbType,
  LikeStatus,
} from '../../../../infrastructure/helpres/types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentLikeEntity } from '../domain/commentLike.entity';

@Injectable()
export class CommentLikeRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(CommentLikeEntity)
    private commentLikeRepo: Repository<CommentLikeEntity>,
  ) {}

  async findLike(commentId: string, userId: string): Promise<string | null> {
    const foundLike = await this.commentLikeRepo.find({
      where: {
        commentId: commentId,
        userId: userId,
      },
    });
    if (foundLike.length > 0) {
      return foundLike[0].id;
    } else {
      return null;
    }
  }

  async save(entity: CommentLikeEntity): Promise<string> {
    const result = await entity.save();
    return result.id;
  }

  async updateLikeStatus(likeStatus: LikeStatus, commentLikeId: string) {
    const date = new Date();
    const result = await this.commentLikeRepo.update(
      {
        id: commentLikeId,
      },
      {
        likeStatus: likeStatus,
        lastUpdate: date,
      },
    );
    return result.affected === 1;
  }

  async deleteCommentLikesByPostId(commentId: string): Promise<boolean> {
    const result = await this.commentLikeRepo
      .createQueryBuilder()
      .delete()
      .where('id = :commentId', { commentId })
      .execute();
    return result.affected === 1;
  }

  async deleteAll() {
    await this.commentLikeRepo.delete({});
  }
}
