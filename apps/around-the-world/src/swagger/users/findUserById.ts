import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { UserDTO } from '../dtoTypes';

export function SwaggerFindUserByIdByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/users'),
    ApiOperation({
      summary: 'Return user by id',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: UserDTO,
    }),

    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
