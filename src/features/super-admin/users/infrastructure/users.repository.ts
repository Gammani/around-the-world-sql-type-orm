import { Injectable } from '@nestjs/common';
import {
  UserAccountDataSqlType,
  UserDbType,
  UserViewDbModelType,
  UserViewEmailDbType,
} from '../../../types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { UserAccountDataEntity } from '../domain/userAccountData.entity';
import { UserEmailDataEntity } from '../domain/userEmailData.entity';
import fs from 'fs/promises';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(UserAccountDataEntity)
    private usersAccountDataRepository: Repository<UserAccountDataEntity>,
    @InjectRepository(UserEmailDataEntity)
    private usersEmailDataRepository: Repository<UserEmailDataEntity>,
  ) {}

  async findUserById(userId: string): Promise<UserViewDbModelType | null> {
    if (validateUUID(userId)) {
      const foundUser = await this.usersEmailDataRepository.find({
        relations: {
          user: true,
        },
        where: {
          user: {
            id: userId,
          },
        },
      });
      if (foundUser.length > 0) {
        return {
          id: foundUser[0].userId,
          accountData: {
            login: foundUser[0].user.login,
            email: foundUser[0].user.email,
            createdAt: foundUser[0].user.createdAt.toISOString(),
            passwordHash: foundUser[0].user.passwordHash,
            recoveryCode: foundUser[0].user.recoveryCode,
          },
          emailConfirmation: {
            confirmationCode: foundUser[0].confirmationCode,
            expirationDate: foundUser[0].expirationDate.toISOString(),
            isConfirmed: foundUser[0].isConfirmed,
          },
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async findUserByLogin(login: string): Promise<UserDbType | null> {
    const foundUser: UserDbType | null = await this.dataSource.query(
      `SELECT "id", "login", "email", "createdAt", "passwordHash", "recoveryCode"
    FROM public."UserAccountData"
    WHERE "login" = $1`,
      [login],
    );
    if (foundUser) {
      return foundUser;
    } else {
      return null;
    }
  }

  async findUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserViewEmailDbType | null> {
    const foundUser = await this.usersEmailDataRepository.find({
      relations: {
        user: true,
      },
      where: {
        confirmationCode: confirmationCode,
      },
    });
    if (foundUser.length > 0) {
      return {
        userId: foundUser[0].userId,
        confirmationCode: foundUser[0].confirmationCode,
        expirationDate: foundUser[0].expirationDate.toISOString(),
        isConfirmed: foundUser[0].isConfirmed,
      };
    } else {
      return null;
    }
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserViewDbModelType | null> {
    const foundUser: UserAccountDataEntity | null =
      await this.usersAccountDataRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userEmailData', 'userEmailData')
        .where('user.email = :loginOrEmail OR user.login = :loginOrEmail', {
          loginOrEmail,
        })
        .getOne();
    if (foundUser) {
      return {
        id: foundUser.id,
        accountData: {
          login: foundUser.login,
          email: foundUser.email,
          createdAt: foundUser.createdAt.toISOString(),
          passwordHash: foundUser.passwordHash,
          recoveryCode: foundUser.recoveryCode,
        },
        emailConfirmation: {
          confirmationCode: foundUser.userEmailData.confirmationCode,
          expirationDate: foundUser.userEmailData.expirationDate.toISOString(),
          isConfirmed: foundUser.userEmailData.isConfirmed,
        },
      };
    } else {
      return null;
    }
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<boolean> {
    const result: UserAccountDataSqlType[] = await this.dataSource.query(
      `SELECT id, login, email, "createdAt", "passwordHash", "recoveryCode", "expirationDatePasswordRecovery"
FROM public."UserAccountData"
WHERE "UserAccountData"."recoveryCode" = $1`,
      [recoveryCode],
    );
    if (
      result.length > 0 &&
      result[0].expirationDatePasswordRecovery > new Date()
    ) {
      return true;
    } else {
      return false;
    }
  }

  async findUserByPasswordRecoveryCode(
    passwordRecoveryCode: string,
  ): Promise<boolean> {
    const foundUser = await this.usersAccountDataRepository.find({
      where: {
        recoveryCode: passwordRecoveryCode,
      },
    });
    if (
      foundUser.length > 0 &&
      foundUser[0].expirationDatePasswordRecovery > new Date()
    ) {
      return true;
    } else {
      return false;
    }
  }

  // async createUser(
  //   createdUserDataDto: UserAccountDataEntity,
  //   createdEmailDataDto: UserEmailDataEntity,
  // ): Promise<any> {
  //   await this.usersAccountDataRepository.save(createdUserDataDto);
  //   await this.usersEmailDataRepository.save(createdEmailDataDto);
  //   return {
  //     id: createdUserDataDto.id,
  //     login: createdUserDataDto.login,
  //     email: createdUserDataDto.email,
  //     createdAt: createdUserDataDto.createdAt,
  //   };
  // }
  async save(
    entity: UserAccountDataEntity | UserEmailDataEntity,
  ): Promise<string> {
    const result = await entity.save();

    return result instanceof UserEmailDataEntity
      ? result.userId
      : (result.id as string);
  }

  async loginIsExist(login: string): Promise<boolean> {
    const foundUser = await this.usersAccountDataRepository.find({
      where: {
        login: login,
      },
    });
    return foundUser.length <= 0;
  }

  async emailIsExist(email: string): Promise<boolean> {
    const foundUser = await this.usersAccountDataRepository.find({
      where: {
        email: email,
      },
    });
    return foundUser.length <= 0;
  }

  async emailIsValid(email: string): Promise<boolean> {
    const foundUser = await this.dataSource.query(
      `SELECT "id", "login", "email", "createdAt", "passwordHash", "recoveryCode"
    FROM public."UserAccountData"
    WHERE "email" = $1`,
      [email],
    );
    return foundUser.length > 0;
  }

  async emailIsConfirmed(email: string): Promise<boolean> {
    const foundUser = await this.findUserByLoginOrEmail(email);
    if (foundUser) {
      if (foundUser.emailConfirmation.isConfirmed !== true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async updateConfirmationStatus(userId: string): Promise<boolean> {
    const result = await this.usersEmailDataRepository
      .createQueryBuilder()
      .update()
      .set({ isConfirmed: true })
      .where(`userId = :userId`, { userId })
      .execute();
    return result.affected === 1;
  }

  async updateConfirmationCode(
    userId: string,
    code: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const result = await this.usersEmailDataRepository
      .createQueryBuilder()
      .update()
      .set({ confirmationCode: code, expirationDate: expirationDate })
      .where(`userId = :userId`, { userId })
      .execute();
    return result.affected === 1;
  }

  async updatePassword(
    passwordHash: string,
    recoveryCode: string,
  ): Promise<boolean> {
    const result = await this.usersAccountDataRepository
      .createQueryBuilder()
      .update()
      .set({
        passwordHash: passwordHash,
      })
      .where(`recoveryCode = :recoveryCode`, { recoveryCode })
      .execute();
    return result.affected === 1;
  }

  async updatePasswordRecoveryCode(
    email: string,
    recoveryCode: string,
    expirationDatePasswordRecovery: Date,
  ) {
    const result = await this.usersAccountDataRepository
      .createQueryBuilder()
      .update()
      .set({
        recoveryCode: recoveryCode,
        expirationDatePasswordRecovery: expirationDatePasswordRecovery,
      })
      .where(`email = :email`, { email })
      .execute();
    return result.affected === 1;
  }

  async deleteUser(userId: string): Promise<boolean> {
    await this.usersEmailDataRepository
      .createQueryBuilder()
      .delete()
      .from('userEmailData')
      .where(`userId = :userId`, { userId })
      .execute();
    await this.usersAccountDataRepository
      .createQueryBuilder()
      .delete()
      .from('userAccountData')
      .where(`id = :userId`, { userId })
      .execute();
    return true;
  }

  async deleteAll() {
    await this.usersEmailDataRepository
      .createQueryBuilder()
      .delete()
      .from('userEmailData')
      .execute();
    await this.usersAccountDataRepository
      .createQueryBuilder()
      .delete()
      .from('userAccountData')
      .execute();
    return;
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
