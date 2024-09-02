import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BlogIdDTO,
  PageNumberDTO,
  PageSizeDTO,
  PostWithPaginationViewModelDTO,
  SortByDTO,
  SortDirectionDTO,
} from '../../dtoTypes';

export function SwaggerGetPostByIdEndpoint() {
  return applyDecorators(
    ApiTags('admin/blogs'),
    ApiOperation({
      summary: 'Return post by id for specified blogId ',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: PostWithPaginationViewModelDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
  );
}
