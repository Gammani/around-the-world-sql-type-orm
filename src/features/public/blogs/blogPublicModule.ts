import { GetAllQueryBlogsUseCase } from './application/use-cases/getAllQueryBlogs.useCase';
import { CreateBlogByAdminUseCase } from '../../super-admin/blogs/application/use-cases/createBlogByAdmin.useCase';
import { GetBlogByIdUseCase } from './application/use-cases/getBlogById.useCase';
import { GetQueryBlogByIdUseCase } from './application/use-cases/getQueryBlogById.useCase';
import { UpdateBlogByAdminUseCase } from '../../super-admin/blogs/application/use-cases/updateBlogByAdmin.useCase';
import { RemoveBlogByAdminUseCase } from '../../super-admin/blogs/application/use-cases/removeBlogByAdmin.useCase';
import { Module } from '@nestjs/common';
import { PostModule } from '../posts/post.module';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from '../../super-admin/blogs/application/blogs.service';
import { BlogsRepository } from '../../super-admin/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../super-admin/blogs/infrastructure/blogs.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from '../../super-admin/blogs/domain/blogs.entity';

const useCases = [
  GetAllQueryBlogsUseCase,
  CreateBlogByAdminUseCase,
  GetBlogByIdUseCase,
  GetQueryBlogByIdUseCase,
  UpdateBlogByAdminUseCase,
  RemoveBlogByAdminUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), PostModule, SharingModule],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, ...useCases],
  exports: [TypeOrmModule.forFeature([BlogEntity])],
})
export class BlogPublicModule {}
