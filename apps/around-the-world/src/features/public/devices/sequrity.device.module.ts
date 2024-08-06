import { forwardRef, Module } from '@nestjs/common';
import { SecurityDeviceController } from './api/security.device.controller';
import { SecurityDevicesService } from './application/security.devices.service';
import { DeviceRepository } from './infrastructure/device.repository';
import { DeviceQueryRepository } from './infrastructure/device.query.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { JwtService } from '../auth/application/jwt.service';
import { AddDeviceUseCase } from './application/use-cases/addDevice.useCase';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteCurrentSessionUseCase } from './application/use-cases/deleteCurrentSessionById.useCase';
import { FoundDeviceFromUserUseCase } from './application/use-cases/foundDeviceFromUserUseCase';
import { GetDeviceByDeviceIdUseCase } from './application/use-cases/getDeviceByDeviceId.useCase';
import { DeleteAllSessionExcludeCurrentUseCase } from './application/use-cases/deleteAllSessionExcludeCurrent.useCase';
import { GetUserIdByDeviceIdUseCase } from '../../super-admin/users/application/use-cases/getUserIdByDeviceIdUseCase';
import { UsersService } from '../../super-admin/users/application/users.service';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { EmailManager } from '../../adapter/email.manager';
import { AddExpiredRefreshTokenUseCase } from '../auth/application/use-cases/addExpiredRefreshTokenUseCase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../super-admin/users/infrastructure/users.query.repository';
import { UsersModule } from '../../super-admin/users/users.module';
import { DeviceEntity } from './domain/devices.entity';
import { ExpiredTokenModule } from '../expiredToken/expired.token.module';

const useCases = [
  DeleteCurrentSessionUseCase,
  AddDeviceUseCase,
  FoundDeviceFromUserUseCase,
  GetUserIdByDeviceIdUseCase,
  GetDeviceByDeviceIdUseCase,
  AddExpiredRefreshTokenUseCase,
  DeleteAllSessionExcludeCurrentUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity]),
    CqrsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => ExpiredTokenModule),
  ],
  controllers: [SecurityDeviceController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SecurityDevicesService,
    DeviceRepository,
    DeviceQueryRepository,
    ExpiredTokenRepository,
    PasswordAdapter,
    JwtService,
    EmailManager,
    DeviceEntity,
    ...useCases,
  ],
  exports: [
    TypeOrmModule.forFeature([DeviceEntity]),
    DeviceEntity,
    DeviceRepository,
  ],
})
export class SecurityDeviceModule {}
