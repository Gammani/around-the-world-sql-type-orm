import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateModel } from '../../api/models/input/create-user.input.model';
import { CreatedUserViewModel } from '../../api/models/output/user.output.model';
import { UsersRepository } from '../../infrastructure/userRawSqlRepo/users.repository';
import { PasswordAdapter } from '../../../../adapter/password.adapter';
import { UserAccountDataEntity } from '../../domain/userAccountData.entity';
import { UserEmailDataEntity } from '../../domain/userEmailData.entity';
import { UsersRepo } from '../../infrastructure/usersTypeOrmRepo/users.repo';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';

export class CreateUserByAdminCommand {
  constructor(public inputUserModel: UserCreateModel) {}
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase
  implements ICommandHandler<CreateUserByAdminCommand>
{
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    protected usersRepo: UsersRepo,
    public UserAccountDataEntity: UserAccountDataEntity,
    public UserEmailDataEntity: UserEmailDataEntity,
  ) {}

  async execute(command: CreateUserByAdminCommand): Promise<string> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      command.inputUserModel.password,
    );
    const createdAt = new Date();

    const createdUserDataDto = new UserAccountDataEntity();
    createdUserDataDto.login = command.inputUserModel.login;
    createdUserDataDto.email = command.inputUserModel.email;
    createdUserDataDto.createdAt = createdAt;
    createdUserDataDto.passwordHash = passwordHash;
    createdUserDataDto.recoveryCode = uuidv4();
    createdUserDataDto.expirationDatePasswordRecovery = add(createdAt, {
      hours: 1,
      minutes: 3,
    });

    const userId = await this.usersRepo.save(createdUserDataDto);

    const createdEmailDataDto = new UserEmailDataEntity();
    createdEmailDataDto.id = userId;
    createdEmailDataDto.confirmationCode = uuidv4();
    createdEmailDataDto.expirationDate = add(createdAt, {
      hours: 1,
      minutes: 3,
    });
    createdEmailDataDto.isConfirmed = true;
    await this.usersRepo.save(createdEmailDataDto);

    return userId;
  }
}
