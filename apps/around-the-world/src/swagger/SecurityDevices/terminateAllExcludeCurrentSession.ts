import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function SwaggerTerminateAllExcludeCurrentSessionEndpoint() {
  return applyDecorators(
    ApiTags('SecurityDevices'),
    ApiOperation({
      summary: 'Terminate all other (exclude current) devices sessions',
    }),
    ApiCookieAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
