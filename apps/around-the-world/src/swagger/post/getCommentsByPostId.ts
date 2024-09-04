import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CommentsWithPaginationViewModelDTO,
  PageNumberDTO,
  PageSizeDTO,
  PostIdDTO,
  SortByDTO,
  SortDirectionDTO,
} from '../dtoTypes';

export function SwaggerGetCommentsByPostIdEndpoint() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiOperation({
      summary: 'Returns comments for specified post',
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
      type: CommentsWithPaginationViewModelDTO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: `If post for passed postId doesn't exist`,
    }),
  );
}
