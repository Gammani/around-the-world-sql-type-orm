import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuizGameViewModel } from '../../dtoTypes';

export function SwaggerReturnCurrentUnfinishedGameEndpoint() {
  return applyDecorators(
    ApiTags('QuizGame'),
    ApiOperation({
      summary: 'Returns current pair in which current user is taking part',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns current pair in which current user is taking part',
      type: QuizGameViewModel,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'If no active pair for current user',
    }),
  );
}
