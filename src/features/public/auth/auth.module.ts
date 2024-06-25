import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { UsersService } from '../../super-admin/users/application/users.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './application/auth.service';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { JwtService } from './application/jwt.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { ConfirmEmailUseCase } from './application/use-cases/confirmEmail.useCase';
import { UpdatePasswordUseCase } from './application/use-cases/updatePassword.useCase';
import { PasswordRecoveryUseCase } from './application/use-cases/passwordRecovery.useCase';
import { FindAndUpdateDeviceAfterRefreshUseCase } from '../devices/application/use-cases/findAndUpdateDeviceAfterRefresh.useCase';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { EmailManager } from '../../adapter/email.manager';
import { LoginIsExistConstraint } from '../../../infrastructure/decorators/validate/login.isExist.decorator';
import { EmailCodeIsConfirmConstraint } from '../../../infrastructure/decorators/validate/email-code-is-confirm-constraint.service';
import { EmailIsExistConstraint } from '../../../infrastructure/decorators/validate/email.isExist.decorator';
import { EmailIsConfirmedConstraint } from '../../../infrastructure/decorators/validate/email.isConfirmed.decorator';
import { IsValidRecoveryCodeConstraint } from '../../../infrastructure/decorators/validate/isValid.recoveryCode.decorator';
import { IsValidEmailConstraint } from '../../../infrastructure/decorators/validate/email.isValid.decorator';
import { IsValidPasswordRecoveryCodeConstraint } from '../../../infrastructure/decorators/validate/isValid.passwordRecoveryCode.decorator';
import { RegistrationResendCodeUseCase } from './application/use-cases/registrationResendCode.useCase';
import { AddExpiredRefreshTokenUseCase } from './application/use-cases/addExpiredRefreshTokenUseCase';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountDataEntity } from '../../super-admin/users/domain/userAccountData.entity';
import { UserEmailDataEntity } from '../../super-admin/users/domain/userEmailData.entity';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../super-admin/users/infrastructure/users.query.repository';
import { ExpiredTokenModule } from '../expiredToken/expired.token.module';
import { UsersModule } from '../../super-admin/users/users.module';
import { SecurityDeviceModule } from '../devices/sequrity.device.module';

const useCases = [
  ConfirmEmailUseCase,
  UpdatePasswordUseCase,
  PasswordRecoveryUseCase,
  PasswordRecoveryUseCase,
  FindAndUpdateDeviceAfterRefreshUseCase,
  RegistrationResendCodeUseCase,
  AddExpiredRefreshTokenUseCase,
];
const decorators = [
  LoginIsExistConstraint,
  EmailCodeIsConfirmConstraint,
  EmailIsExistConstraint,
  EmailIsConfirmedConstraint,
  IsValidRecoveryCodeConstraint,
  IsValidEmailConstraint,
  IsValidPasswordRecoveryCodeConstraint,
];

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: User.name, schema: UserSchema },
    //   { name: Device.name, schema: DeviceSchema },
    //   { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    // ]),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    SharingModule,
    ExpiredTokenModule,
    UsersModule,
    SecurityDeviceModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    PasswordAdapter,
    EmailManager,
    DeviceRepository,
    SecurityDevicesService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    EmailManager,
    ExpiredTokenRepository,
    ...decorators,
    ...useCases,
  ],
})
export class AuthModule {}
