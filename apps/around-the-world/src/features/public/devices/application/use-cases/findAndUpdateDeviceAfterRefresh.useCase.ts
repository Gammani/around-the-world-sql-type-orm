import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../infrastructure/device.repository';

export class FindAndUpdateDeviceAfterRefreshCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(FindAndUpdateDeviceAfterRefreshCommand)
export class FindAndUpdateDeviceAfterRefreshUseCase
  implements ICommandHandler<FindAndUpdateDeviceAfterRefreshCommand>
{
  constructor(private devicesRepository: DeviceRepository) {}

  async execute(command: FindAndUpdateDeviceAfterRefreshCommand) {
    return await this.devicesRepository.findAndUpdateDeviceAfterRefresh(
      command.deviceId,
    );
  }
}
