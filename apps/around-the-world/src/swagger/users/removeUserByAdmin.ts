import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function SwaggerRemoveUserByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/users'),
    ApiOperation({
      summary: 'Delete user specified by id',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'If specified user is not exists',
    }),
  );
}
