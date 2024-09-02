import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function SwaggerRegistrationConfirmationEndpoint() {
  return applyDecorators(
    ApiTags('public/auth'),
    ApiOperation({
      summary: 'Confirm registration',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Email was verified. Account was activated',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the confirmation code is incorrect, expired or already been applied',
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
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
