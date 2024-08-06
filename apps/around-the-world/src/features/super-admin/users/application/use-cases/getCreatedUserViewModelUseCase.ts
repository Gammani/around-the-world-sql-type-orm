import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatedUserViewModel } from '../../api/models/output/user.output.model';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';

export class GetCreatedUserViewModelCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetCreatedUserViewModelCommand)
export class GetCreatedUserViewModelUseCase
  implements ICommandHandler<GetCreatedUserViewModelCommand>
{
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(
    command: GetCreatedUserViewModelCommand,
  ): Promise<CreatedUserViewModel> {
    return await this.usersQueryRepository.getCreatedUserViewModel(
      command.userId,
    );
  }
}
