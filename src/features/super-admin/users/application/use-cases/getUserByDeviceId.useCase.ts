import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserViewDbModelType } from '../../../../types';
import { DeviceRepository } from '../../../../public/devices/infrastructure/device.repository';
import { UsersRepository } from '../../infrastructure/users.repository';

export class GetUserByDeviceIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(GetUserByDeviceIdCommand)
export class GetUserByDeviceIdUseCase
  implements ICommandHandler<GetUserByDeviceIdCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private devicesRepository: DeviceRepository,
  ) {}

  async execute(
    command: GetUserByDeviceIdCommand,
  ): Promise<UserViewDbModelType | null> {
    const userId: string | null =
      await this.devicesRepository.findUserIdByDeviceId(command.deviceId);
    if (userId) {
      return await this.usersRepository.findUserById(userId);
    } else {
      return null;
    }
  }
}
