import { Injectable } from '@nestjs/common';
import {
  CreatedUserViewModel,
  UserViewModel,
  UserWithPaginationViewModel,
} from '../../api/models/output/user.output.model';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as validateUUID } from 'uuid';
import { UserAccountDataEntity } from '../../domain/userAccountData.entity';
import { UserEmailDataEntity } from '../../domain/userEmailData.entity';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(UserAccountDataEntity)
    private readonly userDataRepo: Repository<UserAccountDataEntity>,
    @InjectRepository(UserEmailDataEntity)
    private readonly userEmailRepo: Repository<UserEmailDataEntity>,
  ) {}

  // async findAllUsers(
  //   searchLoginTermQuery: string | undefined,
  //   searchEmailTermQuery: string | undefined,
  //   pageNumberQuery: string | undefined,
  //   pageSizeQuery: string | undefined,
  //   sortByQuery: string | undefined,
  //   sortDirectionQuery: string | undefined,
  // ): Promise<UserWithPaginationViewModel> {
  //   const searchLoginTerm = searchLoginTermQuery ? searchLoginTermQuery : '';
  //   const searchEmailTerm = searchEmailTermQuery ? searchEmailTermQuery : '';
  //   const pageNumber = isNaN(Number(pageNumberQuery))
  //     ? 1
  //     : Number(pageNumberQuery);
  //   const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
  //   const offset = (pageNumber - 1) * pageSize;
  //   const sortBy = sortByQuery ? `${sortByQuery}` : 'account."createdAt"';
  //
  //   const sortDirection = sortDirectionQuery === 'asc' ? 'asc' : 'desc';
  //
  //   const totalUsers = await this.dataSource.query(
  //     `    SELECT account."id", account.login, account.email, account."createdAt", account."passwordHash",
  //       account."recoveryCode", email."confirmationCode", email."expirationDate"
  //   FROM public."UserAccountData" as account
  //   LEFT JOIN "UserEmailData" as email
  //   ON account."id" = email."userId"
  //   WHERE LOWER(email) ILIKE '%${searchEmailTerm}%' OR LOWER(login) ILIKE '%${searchLoginTerm}%'`,
  //     [],
  //   );
  //   const totalCount = totalUsers.length;
  //
  //   const users = await this.dataSource.query(
  //     `    SELECT account."id", account.login, account.email, account."createdAt", account."passwordHash",
  //   account."recoveryCode", email."confirmationCode", email."expirationDate"
  // FROM public."UserAccountData" as account
  // LEFT JOIN "UserEmailData" as email
  // ON account."id" = email."userId"
  // WHERE LOWER(email) ILIKE '%${searchEmailTerm}%' OR LOWER(login) ILIKE '%${searchLoginTerm}%'
  // ORDER BY ${sortBy} ${sortDirection}
  // LIMIT $1 OFFSET $2`,
  //     [pageSize, offset],
  //   );
  //
  //   const pagesCount = Math.ceil(totalCount / pageSize);
  //
  //   return {
  //     pagesCount,
  //     page: pageNumber,
  //     pageSize,
  //     totalCount,
  //     items: users.map((user) => ({
  //       id: user.id.toString(),
  //       login: user.login,
  //       email: user.email,
  //       createdAt: user.createdAt,
  //     })),
  //   };
  // }

  // async findAllUsers(
  //   searchLoginTermQuery: string | undefined,
  //   searchEmailTermQuery: string | undefined,
  //   pageNumberQuery: string | undefined,
  //   pageSizeQuery: string | undefined,
  //   sortByQuery: string | undefined,
  //   ssortDirectionQuery: string | undefined,
  // ) {
  //   const builder = this.userDataRepo
  //     .createQueryBuilder('u')
  //     .leftJoinAndSelect('u.id', 'e');
  //
  //   const sql = builder.getSql();
  //   // console.log(sql);
  //   await writeSql(sql);
  //   return builder.getMany();
  // }

  async findAllUsers(
    searchLoginTermQuery: string | undefined,
    searchEmailTermQuery: string | undefined,
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    ssortDirectionQuery: string | undefined,
  ) {
    const builder = await this.userDataRepo.find({
      relations: {
        userEmailData: true,
      },
    });
    // await this.userEmailRepo.find({ relations: {} });
    // const sql = builder.getSql();
    // // console.log(sql);
    // await writeSql(sql);
    // return builder.getMany();
    console.log(builder);

    // await this.userDataRepo.cre;
    return builder;
  }

  async getCreatedUserViewModel(): Promise<CreatedUserViewModel> {}

  async findUserById(userId: string): Promise<UserViewModel | null> {
    if (validateUUID(userId)) {
      const foundUser = await this.dataSource.query(
        `SELECT account."id", account.login, account.email, account."createdAt", account."passwordHash",
        account."recoveryCode", email."confirmationCode", email."expirationDate"
    FROM public."UserAccountData" as account
    LEFT JOIN "UserEmailData" as email
    ON account."id" = email."userId"
WHERE account."id" = $1`,
        [userId],
      );
      if (foundUser.length > 0) {
        return {
          email: foundUser[0].email,
          login: foundUser[0].login,
          userId: foundUser[0].id,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
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
