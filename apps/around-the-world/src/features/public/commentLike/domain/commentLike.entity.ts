import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccountDataEntity } from '../../../super-admin/users/domain/userAccountData.entity';
import { CommentEntity } from '../../comments/domain/comments.entity';

@Entity({ name: 'commentLikes' })
export class CommentLikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  likeStatus: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  addedAt: Date;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdate: Date;

  @ManyToOne(() => UserAccountDataEntity)
  @JoinColumn()
  user: UserAccountDataEntity;
  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => CommentEntity)
  @JoinColumn()
  comment: CommentEntity;
  @Column({ nullable: false })
  commentId: string;
}
