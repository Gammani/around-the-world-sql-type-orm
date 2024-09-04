import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PageNumberDTO,
  PageSizeDTO,
  PostIdDTO,
  PostsWithPaginationViewModelDTO,
  SortByDTO,
  SortDirectionDTO,
} from '../dtoTypes';

export function SwaggerGetAllPostsEndpoint() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiOperation({
      summary: 'Returns all posts',
    }),
    ApiQuery({
      name: 'sortBy',
      type: SortByDTO,
    }),
    ApiQuery({
      name: 'sortDirection',
      type: SortDirectionDTO,
    }),
    ApiQuery({
      name: 'pageNumber',
      type: PageNumberDTO,
    }),
    ApiQuery({
      name: 'pageSize',
      type: PageSizeDTO,
    }),
    ApiQuery({
      name: 'postId',
      type: PostIdDTO,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: PostsWithPaginationViewModelDTO,
    }),
  );
}
