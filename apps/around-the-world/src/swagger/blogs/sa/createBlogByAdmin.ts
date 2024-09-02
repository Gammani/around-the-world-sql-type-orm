import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlogDTO } from '../../dtoTypes';

export function SwaggerCreateBlogByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/blogs'),
    ApiOperation({
      summary: 'Create new Blog',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns the newly created blog',
      type: BlogDTO,
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
