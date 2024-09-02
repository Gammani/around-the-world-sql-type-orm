import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostDTO } from '../../dtoTypes';

export function SwaggerCreatePostByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/blogs'),
    ApiOperation({
      summary: 'Create new Post fo specific blog',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns the newly created post',
      type: PostDTO,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the inputModel has incorrect values',
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
  );
}
