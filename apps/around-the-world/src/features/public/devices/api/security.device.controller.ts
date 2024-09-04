import { SecurityDevicesService } from '../application/security.devices.service';
import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeviceQueryRepository } from '../infrastructure/device.query.repository';
import { Request } from 'express';
import { RequestWithDeviceId } from '../../auth/api/models/input/auth.input.model';
import { DeleteCurrentSessionByIdCommand } from '../application/use-cases/deleteCurrentSessionById.useCase';
import { CommandBus } from '@nestjs/cqrs';
import { CheckRefreshToken } from '../../auth/guards/jwt-refreshToken.guard';
import { GetDeviceByDeviceIdCommand } from '../application/use-cases/getDeviceByDeviceId.useCase';
import { DeleteAllSessionExcludeCurrentCommand } from '../application/use-cases/deleteAllSessionExcludeCurrent.useCase';
import { UsersService } from '../../../super-admin/users/application/users.service';
import { UserViewDbModelType } from '../../../../infrastructure/helpres/types';
import { GetUserIdByDeviceIdCommand } from '../../../super-admin/users/application/use-cases/getUserIdByDeviceId.useCase';
import { SwaggerGetAllDevicesFromUserEndpoint } from '../../../../swagger/SecurityDevices/getAllDevicesFromUser';
import { SwaggerTerminateAllExcludeCurrentSessionEndpoint } from '../../../../swagger/SecurityDevices/terminateAllExcludeCurrentSession';
import { SwaggerTerminateSessionByIdEndpoint } from '../../../../swagger/SecurityDevices/terminateSessionById';

@UseGuards(CheckRefreshToken)
@Controller('security/devices')
export class SecurityDeviceController {
  constructor(
    private securityDeviceService: SecurityDevicesService,
    private deviceQueryRepository: DeviceQueryRepository,
    private userService: UsersService,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @SwaggerGetAllDevicesFromUserEndpoint()
  async getAllDevicesFromUser(@Req() req: Request & RequestWithDeviceId) {
    const foundUser: UserViewDbModelType | null =
      await this.userService.findUserByDeviceId(req.deviceId);
    if (foundUser)
      return await this.deviceQueryRepository.findAllActiveSessionFromUserId(
        foundUser.id,
      );
  }

  @Delete()
  @SwaggerTerminateAllExcludeCurrentSessionEndpoint()
  @HttpCode(204)
  async terminateAllExcludeCurrentSession(
    @Req() req: Request & RequestWithDeviceId,
  ) {
    debugger;
    const userId = await this.commandBus.execute(
      new GetUserIdByDeviceIdCommand(req.deviceId),
    );
    await this.commandBus.execute(
      new DeleteAllSessionExcludeCurrentCommand(req.deviceId, userId),
    );
  }

  @Delete(':deviceId')
  @SwaggerTerminateSessionByIdEndpoint()
  @HttpCode(204)
  async terminateSessionById(
    @Req() req: Request & RequestWithDeviceId,
    @Param('deviceId') deviceId: string,
  ) {
    const foundDeviceByDeviceId = await this.commandBus.execute(
      new GetDeviceByDeviceIdCommand(deviceId),
    );

    if (foundDeviceByDeviceId) {
      const foundUserByDeviceIdFromToken: UserViewDbModelType | null =
        await this.commandBus.execute(
          new GetUserIdByDeviceIdCommand(req.deviceId),
        );
      const foundUserFromUriParam: UserViewDbModelType | null =
        await this.commandBus.execute(new GetUserIdByDeviceIdCommand(deviceId));
      if (
        foundUserFromUriParam?.id.toString() ===
        foundUserByDeviceIdFromToken?.id.toString()
      ) {
        await this.commandBus.execute(
          new DeleteCurrentSessionByIdCommand(deviceId),
        );
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
