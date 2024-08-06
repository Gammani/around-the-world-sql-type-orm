import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../infrastructure/device.repository';
import { DeviceEntity } from '../../domain/devices.entity';

export class AddDeviceCommand {
  constructor(
    public userId: string,
    public ip: string,
    public deviceName: string,
  ) {}
}

@CommandHandler(AddDeviceCommand)
export class AddDeviceUseCase implements ICommandHandler<AddDeviceCommand> {
  constructor(private devicesRepository: DeviceRepository) {}

  async execute(command: AddDeviceCommand): Promise<string> {
    const createdDevice = new DeviceEntity();
    createdDevice.deviceName = command.deviceName;
    createdDevice.ip = command.ip;
    createdDevice.lastActiveDate = new Date();
    createdDevice.userId = command.userId;

    return await this.devicesRepository.createDevice(createdDevice);
  }
}
