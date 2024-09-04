import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function SwaggerRemoveCommentByIdEndpoint() {
  return applyDecorators(
    ApiTags('Comments'),
    ApiOperation({
      summary: 'Delete comment specified by id',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'If try delete the comment that is not your own',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
  );
}
