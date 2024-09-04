import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentDTO } from '../dtoTypes';

export function SwaggerCreateCommentByPostIdEndpoint() {
  return applyDecorators(
    ApiTags('Posts'),
    ApiOperation({
      summary: 'Create new comment',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns the newly created comment',
      type: CommentDTO,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the inputModel has incorrect values.',
      schema: {
        example: {
          errorsMessages: [
            {
              message: 'string',
              field: 'string',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: `If post with specified postId doesn't exists`,
    }),
  );
}
