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
import { ExpiredTokenModule } from '../expiredToken/expired.token.module';
import { SecurityDeviceModule } from '../devices/sequrity.device.module';
import { BlogSuperAdminModule } from '../../super-admin/blogs/blogSuperAdminModule';

@Module({
  imports: [
    SharingModule,
    UsersModule,
    ExpiredTokenModule,
    SecurityDeviceModule,
    BlogSuperAdminModule,
  ],
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
