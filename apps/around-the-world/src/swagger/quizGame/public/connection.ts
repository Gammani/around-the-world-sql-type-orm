import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuizGameViewModel } from '../../dtoTypes';

export function SwaggerConnectionEndpoint() {
  return applyDecorators(
    ApiTags('QuizGame'),
    ApiOperation({
      summary:
        'Connect current user to existing random pending pair or create new pair which will be waiting second player',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'Returns started existing pair or new pair with status "PendingSecondPlayer"',
      type: QuizGameViewModel,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'If current user tries to get pair in which user is not participant',
    }),
  );
}
