import { Module } from '@nestjs/common';
import { TestingRemoveAll } from './removeAll.controller';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { PostLikeRepository } from '../postLike/infrastructure/postLike.repository';
import { CommentLikeRepository } from '../commentLike/infrastructure/commentLike.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { BlogsRepository } from '../../super-admin/blogs/infrastructure/blogs.repository';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { UsersModule } from '../../super-admin/users/users.module';

@Module({
  imports: [SharingModule, UsersModule],
  controllers: [TestingRemoveAll],
  providers: [
    BlogsRepository,
    PostsRepository,
    CommentsRepository,
    DeviceRepository,
    PostLikeRepository,
    CommentLikeRepository,
    ExpiredTokenRepository,
    PasswordAdapter,
  ],
})
export class RemoveAllModule {}
