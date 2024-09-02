import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuizQuestionDTO } from '../../dtoTypes';

export function SwaggerCreateQuestionEndpoint() {
  return applyDecorators(
    ApiTags('admin/QuizQuestions'),
    ApiOperation({
      summary: 'Create question',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Created',
      type: QuizQuestionDTO,
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
  );
}
