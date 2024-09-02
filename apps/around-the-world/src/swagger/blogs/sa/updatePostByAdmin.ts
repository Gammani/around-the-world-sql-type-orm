import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function SwaggerUpdatePostByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/blogs'),
    ApiOperation({
      summary: 'Update existing post by id with InputModel',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
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
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
  );
}
