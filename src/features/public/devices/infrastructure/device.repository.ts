import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DeviceDbViewModelType } from '../../../types';
import { validate as validateUUID } from 'uuid';
import { DataSource, getConnection, Not, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from '../domain/devices.entity';
import fs from 'fs/promises';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async createDevice(createdDevice: DeviceEntity): Promise<string> {
    const result = await createdDevice.save();
    return result.id;
  }
  // async findDeviceByDeviceId(deviceId: ObjectId): Promise<DeviceDbType | null> {
  //   return this.DeviceModel.findOne({ _id: deviceId });
  // }
  async findUserIdByDeviceId(deviceId: string): Promise<string | null> {
    if (validateUUID(deviceId)) {
      const foundDevice: DeviceDbViewModelType | null =
        await this.deviceRepository
          .createQueryBuilder('device')
          .where('device.id = :id', { id: deviceId })
          .getOne();
      if (foundDevice) {
        return foundDevice.userId;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  async findAndUpdateDeviceAfterRefresh(deviceId: string) {
    const newDate = new Date();
    const result = await this.deviceRepository
      .createQueryBuilder()
      .update()
      .set({ lastActiveDate: newDate })
      .where('id = :id', { id: deviceId })
      .execute();
    return result.affected === 1;
  }

  // async findDeviceFromUserId(
  //   deviceId: string,
  //   userId: ObjectId,
  // ): Promise<boolean> {
  //   const result = await this.DeviceModel.findOne({
  //     _id: deviceId,
  //     userId: userId,
  //   });
  //   if (result) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  async findDeviceByDeviceId(
    deviceId: string,
  ): Promise<DeviceDbViewModelType | null> {
    if (validateUUID(deviceId)) {
      const foundDevice = await this.deviceRepository
        .createQueryBuilder('device')
        .where('device.id = :id', { id: deviceId })
        .getOne();
      if (foundDevice) {
        return {
          id: foundDevice.id,
          userId: foundDevice.userId,
          ip: foundDevice.ip,
          deviceName: foundDevice.deviceName,
          lastActiveDate: foundDevice.lastActiveDate,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
    if (validateUUID(deviceId)) {
      //       await this.dataSource.query(
      //         `DELETE FROM public."Device"
      // WHERE id = $1;`,
      //         [deviceId],
      //       );
      await this.deviceRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: deviceId })
        .execute();
      return true;
    } else {
      return false;
    }
  }
  async deleteAllSessionExcludeCurrent(deviceId: string, userId: string) {
    await this.deviceRepository
      .createQueryBuilder()
      .delete()
      .from('device')
      .where(`device.id <> :deviceId AND device."userId" = :userId`, {
        deviceId,
        userId,
      })
      .execute();
    return;
  }
  // async deleteAllSessionExcludeCurrent(deviceId: string, userId: string) {
  //   await getConnection()
  //     .getRepository('device')
  //     .delete({ id: { $ne: deviceId }, userId });
  // }
  async deleteAll() {
    await this.deviceRepository.createQueryBuilder().delete().execute();
  }
  // для своего теста
  async findDeviceTestByUserId(userId: string) {
    return await this.dataSource.query(
      `SELECT id, ip, "deviceName", "lastActiveDate", "userId"
FROM public."Device"
WHERE "userId" = $1;`,
      [userId],
    );
  }
}
const writeSql = async (sql: string) => {
  // eslint-disable-next-line
  const fs = require('fs/promises');
  try {
    await fs.writeFile('sql.txt', sql);
  } catch (error) {
    console.log(error);
  }
};
