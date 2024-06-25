import { Injectable } from '@nestjs/common';
import { DeviceViewModel } from '../api/models/output/device.output.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DeviceEntity } from '../domain/devices.entity';

@Injectable()
export class DeviceQueryRepository {
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findAllActiveSessionFromUserId(
    userId: string,
  ): Promise<DeviceViewModel[] | undefined> {
    const result = await this.deviceRepository
      .createQueryBuilder('device')
      .where('device.userId = :userId', { userId })
      .getMany();
    return result.map((i) => ({
      ip: i.ip,
      title: i.deviceName,
      lastActiveDate: i.lastActiveDate.toISOString(),
      deviceId: i.id,
    }));
  }
}
