import { Module } from '@nestjs/common';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { CommentsRepository } from './infrastructure/comments.repository';
import { JwtService } from '../auth/application/jwt.service';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { CommentsQueryRepository } from './infrastructure/comments.query.repository';
import { CommentLikeService } from '../commentLike/appliacation/commentLike.service';
import { CommentLikeRepository } from '../commentLike/infrastructure/commentLike.repository';
import { GetQueryCommentsByPostIdUseCase } from './application/use-cases/getQueryCommentsByPostId.useCase';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentUseCase } from './application/use-cases/CreateComment.useCase';
import { GetUserIdByCommentIdUseCase } from './application/use-cases/getUserIdByCommentIdUseCase';
import { GetQueryCommentByIdUseCase } from './application/use-cases/getQueryCommentById.useCase';
import { UpdateCommentUseCase } from './application/use-cases/updateComment.useCase';
import { DeleteCommentByIdUseCase } from './application/use-cases/deleteCommentById.useCase';
import { GetCommentLikeUseCase } from '../commentLike/appliacation/use-cases/getCommentLike.useCase';
import { UpdateCommentLikeUseCase } from '../commentLike/appliacation/use-cases/updateCommentLike.useCase';
import { CreateCommentLikeUseCase } from '../commentLike/appliacation/use-cases/createCommentLike.useCase';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { EmailManager } from '../../adapter/email.manager';
import { UsersService } from '../../super-admin/users/application/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../super-admin/users/infrastructure/users.query.repository';
import { ExpiredTokenModule } from '../expiredToken/expired.token.module';
import { UsersModule } from '../../super-admin/users/users.module';
import { SecurityDeviceModule } from '../devices/sequrity.device.module';
import { CommentEntity } from './domain/comments.entity';
import { CommentLikeEntity } from '../commentLike/domain/commentLike.entity';
import { GetCommentIdByIdUseCase } from './application/use-cases/getCommentIdByIdUseCase';

const useCases = [
  GetQueryCommentsByPostIdUseCase,
  CreateCommentUseCase,
  GetUserIdByCommentIdUseCase,
  GetQueryCommentByIdUseCase,
  UpdateCommentUseCase,
  DeleteCommentByIdUseCase,
  GetCommentLikeUseCase,
  UpdateCommentLikeUseCase,
  CreateCommentLikeUseCase,
  GetCommentIdByIdUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, CommentLikeEntity]),
    CqrsModule,
    UsersModule,
    ExpiredTokenModule,
    SecurityDeviceModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentLikeService,
    CommentLikeRepository,
    CommentsQueryRepository,
    JwtService,
    PasswordAdapter,
    EmailManager,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SecurityDevicesService,
    DeviceRepository,
    ExpiredTokenRepository,
    ...useCases,
  ],
  exports: [TypeOrmModule.forFeature([CommentEntity, CommentLikeEntity])],
})
export class CommentModule {}
