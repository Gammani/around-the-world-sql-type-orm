import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function SwaggerNewPasswordEndpoint() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Confirm password recovery',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'If code is valid and new password is accepted',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
