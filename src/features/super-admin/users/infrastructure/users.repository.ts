import { Injectable } from '@nestjs/common';
import {
  UserAccountDataSqlType,
  UserDbType,
  UserEmailDataSqlType,
  UserViewDbModelType,
  UserViewEmailDbType,
} from '../../../types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { UserAccountDataEntity } from '../domain/userAccountData.entity';
import { UserEmailDataEntity } from '../domain/userEmailData.entity';

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

  // async findUserByEmail(email: string): Promise<UserDbType | null> {
  //   return this.UserModel.findOne({
  //     'accountData.email': email,
  //   });
  // }

  async findUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserViewEmailDbType | null> {
    debugger;
    const foundUser = await this.dataSource.query(
      `SELECT id, "confirmationCode", "expirationDate", "isConfirmed", "userId"
FROM public."UserEmailData"
WHERE "confirmationCode" = $1`,
      [confirmationCode],
    );
    if (foundUser.length > 0) {
      return {
        userId: foundUser[0].userId,
        confirmationCode: foundUser[0].confirmationCode,
        expirationDate: foundUser[0].expirationDate,
        isConfirmed: foundUser[0].isConfirmed,
      };
    } else {
      return null;
    }
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserViewDbModelType | null> {
    const foundUser: UserAccountDataSqlType[] = await this.dataSource.query(
      `SELECT id, login, email, "createdAt", "passwordHash", "recoveryCode"
FROM public."userAccountData"
WHERE "userAccountData".email = $1
OR "userAccountData".login = $1;`,
      [loginOrEmail],
    );
    if (foundUser.length > 0) {
      const foundEmailData: UserEmailDataSqlType[] =
        await this.dataSource.query(
          `SELECT "userId", "confirmationCode", "expirationDate", "isConfirmed", "userId"
FROM public."userEmailData"
WHERE "userId" = $1`,
          [foundUser[0].id],
        );
      if (foundEmailData.length > 0) {
        return {
          id: foundUser[0].id,
          accountData: {
            login: foundUser[0].login,
            email: foundUser[0].email,
            createdAt: foundUser[0].createdAt,
            passwordHash: foundUser[0].passwordHash,
            recoveryCode: foundUser[0].recoveryCode,
          },
          emailConfirmation: {
            confirmationCode: foundEmailData[0].confirmationCode,
            expirationDate: foundEmailData[0].expirationDate,
            isConfirmed: foundEmailData[0].isConfirmed,
          },
        };
      } else {
        return null;
      }
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
    const result: UserAccountDataSqlType[] = await this.dataSource.query(
      `SELECT id, login, email, "createdAt", "passwordHash", "recoveryCode", "expirationDatePasswordRecovery"
FROM public."UserAccountData"
WHERE "UserAccountData"."recoveryCode" = $1`,
      [passwordRecoveryCode],
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

  async updateConfirmationStatus(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."UserEmailData"
SET "isConfirmed"=true
WHERE "UserEmailData"."userId" = $1;`,
      [id],
    );
    return result[1] === 1;
  }

  async updateConfirmationCode(
    userId: string,
    code: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."UserEmailData"
SET "confirmationCode" = $1, "expirationDate" = $2
WHERE "UserEmailData"."userId" = $3;`,
      [code, expirationDate, userId],
    );
    return result[1] === 1;
  }

  async updatePassword(
    passwordHash: string,
    recoveryCode: string,
  ): Promise<boolean> {
    return this.dataSource.query(
      `UPDATE public."UserAccountData"
SET "passwordHash"=$1
WHERE "recoveryCode" = $2`,
      [passwordHash, recoveryCode],
    );
    // return result[1] === 1;
  }

  async updatePasswordRecoveryCode(
    email: string,
    recoveryCode: string,
    expirationDatePasswordRecovery: Date,
  ) {
    const result = await this.dataSource.query(
      `UPDATE public."UserAccountData"
SET "recoveryCode" = $1, "expirationDatePasswordRecovery" = $2
WHERE "UserAccountData"."email" = $3;`,
      [recoveryCode, expirationDatePasswordRecovery, email],
    );
    return result[1] === 1;
    // const result = await this.UserModel.updateOne(
    //   { 'accountData.email': email },
    //   { $set: { 'accountData.recoveryCode': recoveryCode } },
    // );
    // return result.modifiedCount === 1;
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
    await this.dataSource.query(`DELETE FROM public."UserEmailData"`);
    await this.dataSource.query(`DELETE FROM public."UserAccountData"`);
    return;
  }
}
