import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogDTO } from '../../dtoTypes';

export function SwaggerFindBlogByIdEndpoint() {
  return applyDecorators(
    ApiTags('public/blogs'),
    ApiOperation({
      summary: 'Return blog by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: BlogDTO,
    }),
  );
}
