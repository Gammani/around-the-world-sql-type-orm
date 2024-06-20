import { CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../../../public/devices/infrastructure/device.repository';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';

export class GetUserViewModelByDeviceIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(GetUserViewModelByDeviceIdCommand)
export class GetUserViewModelByDeviceIdUseCase {
  constructor(
    private devicesRepository: DeviceRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: GetUserViewModelByDeviceIdCommand) {
    const userId = await this.devicesRepository.findUserIdByDeviceId(
      command.deviceId,
    );
    if (userId) {
      return await this.usersQueryRepository.findUserById(userId.toString());
    } else {
      return null;
    }
  }
}
