import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserInfoDTO } from '../dtoTypes';

export function SwaggerMeEndpoint() {
  return applyDecorators(
    ApiTags('public/auth'),
    ApiOperation({
      summary: 'Get information about current user',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: UserInfoDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
