import { Injectable } from '@nestjs/common';
import { DeviceRepository } from '../infrastructure/device.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(
    protected devicesRepository: DeviceRepository,
    // @InjectModel(Device.name)
    // private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
  ) {}
  async findUserIdByDeviceId(deviceId: string): Promise<string | null> {
    return this.devicesRepository.findUserIdByDeviceId(deviceId);
  }
}
