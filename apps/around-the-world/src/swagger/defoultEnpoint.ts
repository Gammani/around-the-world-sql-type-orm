import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export function SwaggerDefaultEndpoint() {
  return applyDecorators(
    ApiOperation({
      summary: 'Default endpoint',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Hello World!',
    }),
  );
}
