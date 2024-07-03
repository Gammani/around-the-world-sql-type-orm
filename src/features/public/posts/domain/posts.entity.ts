import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogEntity } from '../../../super-admin/blogs/domain/blogs.entity';
import { CommentEntity } from '../../comments/domain/comments.entity';
import { PostLikeEntity } from '../../postLike/domain/postLike.entity';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  shortDescription: string;

  @Column({ nullable: false })
  content: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('uuid')
  blogId: string;

  @ManyToOne(() => BlogEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  blog: BlogEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.postId, {
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @OneToMany(() => PostLikeEntity, (like) => like.postId, {
    onDelete: 'CASCADE',
  })
  postLike: PostLikeEntity;
}
