import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserWithPaginationViewModel } from '../../api/models/output/user.output.model';
import { UsersQueryRepository } from '../../infrastructure/userRawSqlRepo/users.query.repository';
import { UsersQueryRepo } from '../../infrastructure/usersTypeOrmRepo/users.query.repo';

export class GetAllQueryUsersCommand {
  constructor(
    public searchLoginTerm: string | undefined,
    public searchEmailTerm: string | undefined,
    public pageNumber: string | undefined,
    public pageSize: string | undefined,
    public sortBy: string | undefined,
    public sortDirection: string | undefined,
  ) {}
}

@CommandHandler(GetAllQueryUsersCommand)
export class GetAllQueryUsersUseCase
  implements ICommandHandler<GetAllQueryUsersCommand>
{
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersQueryRepo: UsersQueryRepo,
  ) {}

  async execute(command: GetAllQueryUsersCommand) {
    const foundUsers: any = await this.usersQueryRepo.findAllUsers(
      command.searchLoginTerm,
      command.searchEmailTerm,
      command.pageNumber,
      command.pageSize,
      command.sortBy,
      command.sortDirection,
    );
    return foundUsers;
  }
}
