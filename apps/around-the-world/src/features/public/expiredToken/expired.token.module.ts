import { forwardRef, Module } from '@nestjs/common';
import { ExpiredTokenRepository } from './infrastructure/expired.token.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { AddExpiredRefreshTokenUseCase } from '../auth/application/use-cases/addExpiredRefreshTokenUseCase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpiredTokenEntity } from './domain/expired-token.entity';
import { SecurityDeviceModule } from '../devices/sequrity.device.module';

const useCases = [AddExpiredRefreshTokenUseCase];

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpiredTokenEntity]),
    CqrsModule,
    forwardRef(() => SecurityDeviceModule),
  ],
  providers: [
    ExpiredTokenRepository,
    PasswordAdapter,
    SecurityDevicesService,
    DeviceRepository,
    ExpiredTokenEntity,
    ...useCases,
  ],
  exports: [
    TypeOrmModule.forFeature([ExpiredTokenEntity]),
    ExpiredTokenEntity,
    ExpiredTokenRepository,
  ],
})
export class ExpiredTokenModule {}
