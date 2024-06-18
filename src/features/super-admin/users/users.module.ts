import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/userRawSqlRepo/users.repository';
import { UsersQueryRepository } from './infrastructure/userRawSqlRepo/users.query.repository';
import { GetUserViewModelByDeviceIdUseCase } from './application/use-cases/getUserViewModelByDeviceId.useCase';
import { CreateUserUserCase } from './application/use-cases/createUser.useCase';
import { GetUserByDeviceIdUseCase } from './application/use-cases/getUserByDeviceId.useCase';
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
import { GetUserIdByDeviceIdUseCase } from './application/use-cases/getUserIdByDeviceId.useCase';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountDataEntity } from './domain/userAccountData.entity';
import { UserEmailDataEntity } from './domain/userEmailData.entity';
import { UsersRepo } from './infrastructure/usersTypeOrmRepo/users.repo';
import { UsersQueryRepo } from './infrastructure/usersTypeOrmRepo/users.query.repo';

const useCases = [
  CreateUserUserCase,
  GetUserViewModelByDeviceIdUseCase,
  GetUserByDeviceIdUseCase,
  GetAllQueryUsersUseCase,
  GetUserByIdUseCase,
  CreateUserByAdminUseCase,
  DeleteUserByAdminUseCase,
  GetUserViewModelByUserIdUseCase,
  GetUserIdByDeviceIdUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccountDataEntity, UserEmailDataEntity]),
    SharingModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersRepo,
    UsersQueryRepo,
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
  exports: [UsersRepo, UserAccountDataEntity, UserEmailDataEntity],
})
export class UsersModule {}
