import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PageNumberDTO,
  PageSizeDTO,
  SearchNameTermDTO,
  SortByDTO,
  SortDirectionDTO,
  BlogsWithPaginationViewModelDTO,
} from '../../dtoTypes';

export function SwaggerGetAllBlogsByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/blogs'),
    ApiOperation({
      summary: 'Return all blogs with paging',
    }),
    ApiBasicAuth(),
    ApiQuery({
      name: 'searchNameTerm',
      type: SearchNameTermDTO,
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
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: BlogsWithPaginationViewModelDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
