import { Injectable } from '@nestjs/common';
import { PasswordAdapter } from '../../../adapter/password.adapter';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ExpiredTokenEntity } from '../domain/expired-token.entity';

@Injectable()
export class ExpiredTokenRepository {
  constructor(
    @InjectRepository(ExpiredTokenEntity)
    private expiredTokenRepository: Repository<ExpiredTokenEntity>,
    private passwordAdapter: PasswordAdapter,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async findToken(refreshToken: string): Promise<boolean> {
    //   const foundToken = await this.dataSource.query(
    //     `SELECT id, "deviceId", "userId", "refreshToken"
    // FROM public."ExpiredToken"
    // WHERE "refreshToken" = $1`,
    //     [RefreshToken],
    //   );
    const foundExpiredToken = await this.expiredTokenRepository
      .createQueryBuilder('expiredToken')
      .where('expiredToken.refreshToken = :refreshToken', { refreshToken });
    const foundToken = await foundExpiredToken.getOne();
    if (foundToken) {
      return true;
    } else {
      return false;
    }
  }
  async isExpiredToken(refreshToken: string): Promise<boolean> {
    try {
      await this.passwordAdapter.jwtRefreshTokenVerify(refreshToken);
      return false;
    } catch (error: any) {
      console.log(error.message);
      return true;
    }
  }
  async addExpiredRefreshToken(
    deviceId: string,
    userId: string,
    refreshToken: string,
  ) {
    debugger;
    const newExpiredRefreshToken = new ExpiredTokenEntity();
    newExpiredRefreshToken.deviceId = deviceId;
    newExpiredRefreshToken.userId = userId;
    newExpiredRefreshToken.refreshToken = refreshToken;

    await newExpiredRefreshToken.save();
    return;
  }
  async removeAllExpiredTokensByDeviceIdFromUserIdAllSessionExcludeCurrent(
    deviceId: string,
    userId: string,
  ) {
    await this.dataSource.query(
      `DELETE FROM public."expiredToken"
WHERE "expiredToken"."deviceId" <> $1
AND "expiredToken"."userId" = $2`,
      [deviceId, userId],
    );
  }
  async removeExpiredTokensByDeviceId(deviceId: string) {
    //     await this.dataSource.query(
    //       `DELETE FROM public."ExpiredToken"
    // WHERE "ExpiredToken"."deviceId"=$1`,
    //       [deviceId],
    //     );
    await this.expiredTokenRepository
      .createQueryBuilder()
      .delete()
      .from('expiredToken')
      .where('deviceId = :deviceId', {
        deviceId: deviceId,
      })
      .execute();
    return;
  }
  async deleteAll() {
    await this.expiredTokenRepository
      .createQueryBuilder()
      .delete()
      .from('expiredToken')
      .execute();
  }
}
