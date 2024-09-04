import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuizGameViewModel } from '../../dtoTypes';

export function SwaggerFindGameByIdEndpoint() {
  return applyDecorators(
    ApiTags('QuizGame'),
    ApiOperation({
      summary: 'Returns game by id',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns pair by id',
      type: QuizGameViewModel,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the inputModel has incorrect values.',
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
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'If current user tries to get pair in which user is not participant',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'If no active pair for current user',
    }),
  );
}
