import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlogDTO } from '../../dtoTypes';

export function SwaggerFindBlogByIdByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/blogs'),
    ApiOperation({
      summary: 'Return blog by id',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: BlogDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
