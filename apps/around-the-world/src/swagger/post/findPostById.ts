import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostDTO } from '../dtoTypes';

export function SwaggerFindPostByIdEndpoint() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiOperation({
      summary: 'Returns post by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: PostDTO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
  );
}
