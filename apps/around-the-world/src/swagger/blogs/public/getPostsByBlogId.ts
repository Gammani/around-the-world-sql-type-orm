import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BlogIdDTO,
  PageNumberDTO,
  PageSizeDTO,
  PostWithPaginationViewModelDTO,
  SortByDTO,
  SortDirectionDTO,
} from '../../dtoTypes';

export function SwaggerGetPostsByBlogIdEndpoint() {
  return applyDecorators(
    ApiTags('public/blogs'),
    ApiOperation({
      summary: 'Return posts for blog with paging amd sorting',
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
      name: 'blogId',
      type: BlogIdDTO,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: PostWithPaginationViewModelDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
