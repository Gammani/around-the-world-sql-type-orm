import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccountDataEntity } from '../../../super-admin/users/domain/userAccountData.entity';
import { PostEntity } from '../../posts/domain/posts.entity';
import { BlogEntity } from '../../../super-admin/blogs/domain/blogs.entity';

@Entity({ name: 'postLikes' })
export class PostLikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({
    nullable: false,
  })
  likeStatus: string;

  @ManyToOne(() => UserAccountDataEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserAccountDataEntity;
  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: PostEntity;
  @Column({ nullable: false })
  postId: string;

  @ManyToOne(() => BlogEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  blog: BlogEntity;
  @Column({ nullable: false })
  blogId: string;
}
