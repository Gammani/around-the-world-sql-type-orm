import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeviceDTO } from '../dtoTypes';

export function SwaggerGetAllDevicesFromUserEndpoint() {
  return applyDecorators(
    ApiTags('SecurityDevices'),
    ApiOperation({
      summary: 'Return all devices with active sessions for current user',
    }),
    ApiCookieAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: DeviceDTO,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
