import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../public/devices/infrastructure/device.repository';
import { UsersRepository } from '../../infrastructure/users.repository';

export class GetUserIdByDeviceIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(GetUserIdByDeviceIdCommand)
export class GetUserIdByDeviceIdUseCase
  implements ICommandHandler<GetUserIdByDeviceIdCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private devicesRepository: DeviceRepository,
  ) {}

  async execute(command: GetUserIdByDeviceIdCommand): Promise<string | null> {
    return await this.devicesRepository.findUserIdByDeviceId(command.deviceId);
  }
}
