import { Injectable } from '@nestjs/common';
import {
  CreatedUserViewModel,
  UserViewModel,
  UserWithPaginationViewModel,
} from '../api/models/output/user.output.model';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as validateUUID } from 'uuid';
import { UserAccountDataEntity } from '../domain/userAccountData.entity';
import { UserEmailDataEntity } from '../domain/userEmailData.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(UserAccountDataEntity)
    private readonly userDataRepo: Repository<UserAccountDataEntity>,
    @InjectRepository(UserEmailDataEntity)
    private readonly userEmailRepo: Repository<UserEmailDataEntity>,
  ) {}

  async findAllUsers(
    searchLoginTermQuery: string | undefined,
    searchEmailTermQuery: string | undefined,
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
  ): Promise<UserWithPaginationViewModel> {
    const searchLoginTerm = searchLoginTermQuery ? searchLoginTermQuery : '';
    const searchEmailTerm = searchEmailTermQuery ? searchEmailTermQuery : '';
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const offset = (pageNumber - 1) * pageSize;
    const sortBy = sortByQuery ? `${sortByQuery}` : 'createdAt';

    const sortDirection = sortDirectionQuery === 'asc' ? 'asc' : 'desc';

    const totalUsers = await this.userDataRepo.find({
      relations: {
        userEmailData: true,
      },
      where: [
        { email: ILike(`%${searchEmailTerm}%`) },
        { login: ILike(`%${searchLoginTerm}%`) },
      ],
    });

    const totalCount = totalUsers.length;

    const users = await this.userDataRepo.find({
      relations: {
        userEmailData: true,
      },
      where: [
        { email: ILike(`%${searchEmailTerm}%`) },
        { login: ILike(`%${searchLoginTerm}%`) },
      ],
      order: {
        [sortBy]: sortDirection,
      },
      skip: offset,
      take: pageSize,
    });
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: users.map((user) => ({
        id: user.id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      })),
    };
  }

  async getCreatedUserViewModel(userId: string): Promise<CreatedUserViewModel> {
    const foundUser = await this.userEmailRepo.find({
      relations: { user: true },
      where: {
        user: {
          id: userId,
        },
      },
    });
    return {
      id: foundUser[0].user.id,
      login: foundUser[0].user.login,
      email: foundUser[0].user.email,
      createdAt: foundUser[0].user.createdAt.toISOString(),
    };
  }

  async findUserById(userId: string): Promise<UserViewModel | null> {
    if (validateUUID(userId)) {
      const foundUser = await this.userEmailRepo.find({
        relations: { user: true },
        where: {
          user: {
            id: userId,
          },
        },
      });
      if (foundUser.length > 0) {
        return {
          email: foundUser[0].user.email,
          login: foundUser[0].user.login,
          userId: foundUser[0].user.id,
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

// const sql = users.getSql();
// console.log(sql);
// await writeSql(sql);
