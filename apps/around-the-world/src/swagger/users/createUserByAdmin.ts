import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDTO } from '../dtoTypes';

export function SwaggerCreateUserByAdminEndpoint() {
  return applyDecorators(
    ApiTags('admin/users'),
    ApiOperation({
      summary: 'Add new user to the system',
    }),
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns the newly created user',
      type: UserDTO,
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
