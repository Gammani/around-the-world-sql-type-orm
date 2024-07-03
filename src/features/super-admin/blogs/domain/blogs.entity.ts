import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../../../public/posts/domain/posts.entity';
import { PostLikeEntity } from '../../../public/postLike/domain/postLike.entity';

@Entity({ name: 'blogs' })
export class BlogEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  websiteUrl: string;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ default: false })
  isMembership: boolean;

  @OneToMany(() => PostEntity, (post) => post.blogId, { onDelete: 'CASCADE' })
  post: PostEntity;

  @OneToMany(() => PostLikeEntity, (postLike) => postLike.blogId, {
    onDelete: 'CASCADE',
  })
  postLike: PostLikeEntity;
}
