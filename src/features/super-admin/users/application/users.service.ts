import { Injectable } from '@nestjs/common';
import { PasswordAdapter } from '../../../adapter/password.adapter';
import { SecurityDevicesService } from '../../../public/devices/application/security.devices.service';
import { UserViewDbModelType } from '../../../types';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    protected securityDevicesService: SecurityDevicesService,
  ) {}

  async findUserByDeviceId(
    deviceId: string,
  ): Promise<UserViewDbModelType | null> {
    const userId =
      await this.securityDevicesService.findUserIdByDeviceId(deviceId);
    if (userId) {
      return await this.usersRepository.findUserById(userId);
    } else {
      return null;
    }
  }
  async findUserByRecoveryCode(recoveryCode: string): Promise<boolean> {
    return await this.usersRepository.findUserByRecoveryCode(recoveryCode);
  }
  async findUserByPasswordRecoveryCode(
    passwordRecoveryCode: string,
  ): Promise<boolean> {
    return await this.usersRepository.findUserByPasswordRecoveryCode(
      passwordRecoveryCode,
    );
  }
  async loginIsExist(login: string): Promise<boolean> {
    return await this.usersRepository.loginIsExist(login);
  }
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserViewDbModelType | null> {
    const user: UserViewDbModelType | null =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;
    if (!user.emailConfirmation.isConfirmed) return null;

    const isHashesEquals: any = await this.passwordAdapter.isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    );
    if (isHashesEquals) {
      return user;
    } else {
      return null;
    }
  }
  async emailIsExist(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsExist(email);
  }
  async emailIsValid(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsValid(email);
  }
  async emailIsConfirmed(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsConfirmed(email);
  }
}
