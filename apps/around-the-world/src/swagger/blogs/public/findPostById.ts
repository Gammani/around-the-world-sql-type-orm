import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostWithPaginationViewModelDTO } from '../../dtoTypes';

export function SwaggerGetPostByIdEndpoint() {
  return applyDecorators(
    ApiTags('public/blogs'),
    ApiOperation({
      summary: 'Return post by id for specified blogId ',
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
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
  );
}
