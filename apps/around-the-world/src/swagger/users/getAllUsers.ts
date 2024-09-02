import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PageNumberDTO,
  PageSizeDTO,
  SearchEmailTermDTO,
  SearchLoginTermDTO,
  SortByDTO,
  SortDirectionDTO,
  UserWithPaginationViewModelDTO,
} from '../dtoTypes';

export function SwaggerGetAllUsersByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/users'),
    ApiOperation({
      summary: 'Return all users',
    }),
    ApiBasicAuth(),
    ApiQuery({
      name: 'searchLoginTerm',
      type: SearchLoginTermDTO,
    }),
    ApiQuery({
      name: 'searchEmailTerm',
      type: SearchEmailTermDTO,
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
      type: UserWithPaginationViewModelDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
