import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BlogsWithPaginationViewModelDTO,
  PageNumberDTO,
  PageSizeDTO,
  SearchNameTermDTO,
  SortByDTO,
  SortDirectionDTO,
} from '../../dtoTypes';

export function SwaggerGetAllBlogsEndpoint() {
  return applyDecorators(
    ApiTags('public/blogs'),
    ApiOperation({
      summary: 'Return all blogs with paging',
    }),
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
  );
}
