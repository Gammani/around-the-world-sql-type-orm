import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnswerDTO } from '../../dtoTypes';

export function SwaggerSendAnswerFromUserEndpoint() {
  return applyDecorators(
    ApiTags('QuizGame'),
    ApiOperation({
      summary: 'Send answer for next not answered question in active pair',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns answer result',
      type: AnswerDTO,
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
