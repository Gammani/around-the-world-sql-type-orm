import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { GetAllQueryBlogsUseCase } from './application/use-cases/getAllQueryBlogs.useCase';
import { CreateBlogByAdminUseCase } from './application/use-cases/createBlogByAdmin.useCase';
import { GetBlogByIdUseCase } from './application/use-cases/getBlogByIdUseCase';
import { GetQueryBlogByIdUseCase } from './application/use-cases/getQueryBlogById.useCase';
import { UpdateBlogByAdminUseCase } from './application/use-cases/updateBlogByAdmin.useCase';
import { RemoveBlogByAdminUseCase } from './application/use-cases/removeBlogByAdmin.useCase';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './domain/blogs.entity';

const useCases = [
  GetAllQueryBlogsUseCase,
  CreateBlogByAdminUseCase,
  GetBlogByIdUseCase,
  GetQueryBlogByIdUseCase,
  UpdateBlogByAdminUseCase,
  RemoveBlogByAdminUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), SharingModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogEntity,
    ...useCases,
  ],
  exports: [TypeOrmModule.forFeature([BlogEntity]), BlogEntity],
})
export class BlogSuperAdminModule {}
