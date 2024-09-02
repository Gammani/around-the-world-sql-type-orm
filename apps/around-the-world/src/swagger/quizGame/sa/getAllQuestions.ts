import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BodySearchTermDTO,
  PageNumberDTO,
  PageSizeDTO,
  PublishedStatusDTO,
  QuizQuestionsViewModelDTO,
  SortByDTO,
  SortDirectionDTO,
} from '../../dtoTypes';

export function SwaggerGetAllQuestionsEndpoint() {
  return applyDecorators(
    ApiTags('admin/QuizQuestions'),
    ApiOperation({
      summary: 'Return all questions with pagination and filtering',
    }),
    ApiBasicAuth(),
    ApiQuery({
      name: 'bodySearchTerm',
      type: BodySearchTermDTO,
    }),
    ApiQuery({
      name: 'publishedStatus',
      type: PublishedStatusDTO,
    }),
    ApiQuery({
      name: 'sortBy',
      type: SortByDTO,
    }),
    ApiQuery({
      name: 'sortDirection',
      type: SortDirectionDTO,
    }),
    ApiQuery({
      name: 'pageNumber',
      type: PageNumberDTO,
    }),
    ApiQuery({
      name: 'pageSize',
      type: PageSizeDTO,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: QuizQuestionsViewModelDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
