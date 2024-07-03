import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/domain/posts.entity';
import { UserAccountDataEntity } from '../../../super-admin/users/domain/userAccountData.entity';
import { CommentLikeEntity } from '../../commentLike/domain/commentLike.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  content: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => PostEntity)
  @JoinColumn()
  post: PostEntity;
  @Column('uuid')
  postId: string;

  @ManyToOne(() => UserAccountDataEntity)
  @JoinColumn()
  user: UserAccountDataEntity;
  @Column({ nullable: false })
  userId: string;

  @OneToMany(() => CommentLikeEntity, (like) => like.commentId, {})
  commentLike: CommentLikeEntity;
}
