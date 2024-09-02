import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function SwaggerRefreshTokenEndpoint() {
  return applyDecorators(
    ApiTags('public/auth'),
    ApiOperation({
      summary:
        'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)' +
        'Device LastActiveDate should be overrode by issued Date of new refresh token',
    }),
    ApiCookieAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 24 hours).',
      schema: { example: { accessToken: 'string' } },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If the password or login is wrong',
    }),
  );
}
