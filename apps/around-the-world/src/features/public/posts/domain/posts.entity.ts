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

  @Column({ nullable: false, collation: 'C' })
  title: string;

  @Column({ nullable: false, collation: 'C' })
  shortDescription: string;

  @Column({ nullable: false, collation: 'C' })
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

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @OneToMany(() => PostLikeEntity, (like) => like.post, {
    onDelete: 'CASCADE',
  })
  postLike: PostLikeEntity;
}
