import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { PostsWithPaginationViewModel } from './models/output/post.output.model';
import { PostLikeModel } from './models/input/post.like.model';
import { PostLikeService } from '../../postLike/application/postLike.service';
import { Request } from 'express';
import {
  RequestWithDeviceId,
  RequestWithUserId,
} from '../../auth/api/models/input/auth.input.model';
import { CommentsWithPaginationViewModel } from '../../comments/api/models/output/comment-output.model';
import { CommentInputModel } from './models/input/comment.input.model';
import { CommentsService } from '../../comments/application/comments.service';
import { CommandBus } from '@nestjs/cqrs';
import { GetPostIdByIdCommand } from '../application/use-cases/getPostIdByIdUseCase';
import { CreatePostLikeCommand } from '../../postLike/application/use-cases/createPostLike-useCase';
import { GetPostLikeFromUserCommand } from '../../postLike/application/use-cases/getPostLikeFromUser.useCase';
import { UpdatePostLikeStatusCommand } from '../../postLike/application/use-cases/updatePostLikeStatus.useCase';
import { GetQueryCommentsByPostIdCommand } from '../../comments/application/use-cases/getQueryCommentsByPostId.useCase';
import { GetQueryPostsCommand } from '../application/use-cases/getQueryPostsUseCase';
import { CreateCommentCommand } from '../../comments/application/use-cases/CreateComment.useCase';
import { GetQueryPostByIdCommand } from '../application/use-cases/getQueryPostById.useCase';
import { CheckAccessToken } from '../../auth/guards/jwt-accessToken.guard';
import { UsersService } from '../../../super-admin/users/application/users.service';
import {
  PostLikeViewDbType,
  PostViewDbType,
} from '../../../../infrastructure/helpres/types';
import { GetUserIdByDeviceIdCommand } from '../../../super-admin/users/application/use-cases/getUserIdByDeviceIdUseCase';
import { BlogsService } from '../../../super-admin/blogs/application/blogs.service';
import { SwaggerUpdatePostLikeStatusEndpoint } from '../../../../swagger/post/updatePostLikeStatus';
import { SwaggerGetCommentsByPostIdEndpoint } from '../../../../swagger/post/getCommentsByPostId';
import { SwaggerGetAllPostsEndpoint } from '../../../../swagger/post/getAllPosts';
import { SwaggerCreateCommentByPostIdEndpoint } from '../../../../swagger/post/createCommentByPostId';
import { SwaggerFindPostByIdEndpoint } from '../../../../swagger/post/findPostById';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly userService: UsersService,
    private readonly blogService: BlogsService,
    private readonly postService: PostsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postLikeService: PostLikeService,
    private readonly commentService: CommentsService,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(CheckAccessToken)
  @Put(':postId/like-status')
  @SwaggerUpdatePostLikeStatusEndpoint()
  @HttpCode(204)
  async updatePostLikeStatus(
    @Body() postLikeModel: PostLikeModel,
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundPostId: string | null = await this.commandBus.execute(
      new GetPostIdByIdCommand(postId),
    );

    if (foundPostId) {
      const foundUserId: string | null = await this.commandBus.execute(
        new GetUserIdByDeviceIdCommand(req.deviceId),
      );
      if (foundUserId) {
        const foundPostLikeFromUser: PostLikeViewDbType | null =
          await this.commandBus.execute(
            new GetPostLikeFromUserCommand(postId, foundUserId),
          );
        if (foundPostLikeFromUser) {
          await this.commandBus.execute(
            new UpdatePostLikeStatusCommand(
              postLikeModel.likeStatus,
              foundPostLikeFromUser,
            ),
          );
        } else {
          await this.commandBus.execute(
            new CreatePostLikeCommand(
              foundUserId,
              foundPostId,
              postLikeModel.likeStatus,
            ),
          );
        }
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':postId/comments')
  @SwaggerGetCommentsByPostIdEndpoint()
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithUserId,
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundPost: PostViewDbType | null = await this.commandBus.execute(
      new GetPostIdByIdCommand(postId),
    );
    if (foundPost) {
      const foundCommentsWithUserNoName: CommentsWithPaginationViewModel =
        await this.commandBus.execute(
          new GetQueryCommentsByPostIdCommand(
            query.pageNumber,
            query.pageSize,
            query.sortBy,
            query.sortDirection,
            postId,
            req.user?.userId,
          ),
        );
      return foundCommentsWithUserNoName;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  @SwaggerGetAllPostsEndpoint()
  async getAllPosts(
    @Req() req: Request & RequestWithUserId,
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundPosts: PostsWithPaginationViewModel =
      await this.commandBus.execute(
        new GetQueryPostsCommand(
          query.pageNumber,
          query.pageSize,
          query.sortBy,
          query.sortDirection,
          req.user?.userId,
        ),
      );
    return foundPosts;
  }

  @UseGuards(CheckAccessToken)
  @Post(':postId/comments')
  @SwaggerCreateCommentByPostIdEndpoint()
  async createCommentByPostId(
    @Body() inputCommentModel: CommentInputModel,
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundPostId: string | null = await this.commandBus.execute(
      new GetPostIdByIdCommand(postId),
    );
    if (foundPostId) {
      const foundUserId: string | null = await this.commandBus.execute(
        new GetUserIdByDeviceIdCommand(req.deviceId),
      );
      if (foundUserId) {
        const commentId = await this.commandBus.execute(
          new CreateCommentCommand(inputCommentModel, foundUserId, foundPostId),
        );
        return await this.commentsQueryRepository.findCommentById(
          commentId,
          foundUserId,
        );
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  @SwaggerFindPostByIdEndpoint()
  async findPostById(
    @Param('id') postId: string,
    @Req() req: Request & RequestWithUserId,
  ) {
    const foundPostId: string | null = await this.commandBus.execute(
      new GetPostIdByIdCommand(postId),
    );
    if (foundPostId) {
      return await this.commandBus.execute(
        new GetQueryPostByIdCommand(foundPostId, req.user?.userId),
      );
      // return console.log(res);
    } else {
      throw new NotFoundException();
    }
  }
}
