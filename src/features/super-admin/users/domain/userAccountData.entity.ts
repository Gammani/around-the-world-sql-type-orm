import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEmailDataEntity } from './userEmailData.entity';
import { DeviceEntity } from '../../../public/devices/domain/devices.entity';
import { PostLikeEntity } from '../../../public/postLike/domain/postLike.entity';
import { CommentEntity } from '../../../public/comments/domain/comments.entity';
import { CommentLikeEntity } from '../../../public/commentLike/domain/commentLike.entity';

@Entity({ name: 'userAccountData' })
export class UserAccountDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, collation: 'C' })
  login: string;

  @Column({ nullable: false, collation: 'C' })
  email: string;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  recoveryCode: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expirationDatePasswordRecovery: Date;

  @OneToOne(() => UserEmailDataEntity, (u) => u.user, {})
  userEmailData: UserEmailDataEntity;

  @OneToMany(() => DeviceEntity, (u) => u.userId, {})
  device: DeviceEntity;

  @OneToMany(() => CommentEntity, (com) => com.userId, {})
  comment: CommentEntity;

  @OneToMany(() => PostLikeEntity, (like) => like.userId, {})
  postLikes: PostLikeEntity;

  @OneToMany(() => CommentLikeEntity, (like) => like.userId, {})
  commentLike: CommentLikeEntity;
}
