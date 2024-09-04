import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentDTO } from '../dtoTypes';

export function SwaggerGetCommentByIdEndpoint() {
  return applyDecorators(
    ApiTags('Comments'),
    ApiOperation({
      summary: 'Returns comment by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: CommentDTO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
  );
}
