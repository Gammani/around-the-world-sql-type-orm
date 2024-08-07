import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { GetUserViewModelByDeviceIdUseCase } from './application/use-cases/getUserViewModelByDeviceId.useCase';
import { CreateUserUserCase } from './application/use-cases/createUser.useCase';
import { GetUserIdByDeviceIdUseCase } from './application/use-cases/getUserIdByDeviceIdUseCase';
import { GetAllQueryUsersUseCase } from './application/use-cases/getAllQueryUsers.useCase';
import { GetUserByIdUseCase } from './application/use-cases/getUserById.useCase';
import { CreateUserByAdminUseCase } from './application/use-cases/createUserByAdmin.useCase';
import { DeleteUserByAdminUseCase } from './application/use-cases/deleteUserByAdmin.useCase';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { EmailManager } from '../../adapter/email.manager';
import { SecurityDevicesService } from '../../public/devices/application/security.devices.service';
import { DeviceRepository } from '../../public/devices/infrastructure/device.repository';
import { ExpiredTokenRepository } from '../../public/expiredToken/infrastructure/expired.token.repository';
import { GetUserViewModelByUserIdUseCase } from './application/use-cases/getUserViewModelByUserId.useCase';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountDataEntity } from './domain/userAccountData.entity';
import { UserEmailDataEntity } from './domain/userEmailData.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { GetCreatedUserViewModelUseCase } from './application/use-cases/getCreatedUserViewModelUseCase';
import { ExpiredTokenModule } from '../../public/expiredToken/expired.token.module';
import { SecurityDeviceModule } from '../../public/devices/sequrity.device.module';

const useCases = [
  CreateUserUserCase,
  GetUserViewModelByDeviceIdUseCase,
  GetUserIdByDeviceIdUseCase,
  GetAllQueryUsersUseCase,
  GetUserByIdUseCase,
  CreateUserByAdminUseCase,
  DeleteUserByAdminUseCase,
  GetUserViewModelByUserIdUseCase,
  GetUserIdByDeviceIdUseCase,
  GetCreatedUserViewModelUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccountDataEntity, UserEmailDataEntity]),
    forwardRef(() => ExpiredTokenModule),
    forwardRef(() => SecurityDeviceModule),
    SharingModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    PasswordAdapter,
    EmailManager,
    SecurityDevicesService,
    DeviceRepository,
    ExpiredTokenRepository,
    UserAccountDataEntity,
    UserEmailDataEntity,
    ...useCases,
  ],
  exports: [
    UsersRepository,
    UserAccountDataEntity,
    UserEmailDataEntity,
    TypeOrmModule.forFeature([UserAccountDataEntity, UserEmailDataEntity]),
  ],
})
export class UsersModule {}
