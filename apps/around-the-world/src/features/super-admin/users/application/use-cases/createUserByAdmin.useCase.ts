import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateModel } from '../../api/models/input/create-user.input.model';
import { PasswordAdapter } from '../../../../adapter/password.adapter';
import { UserAccountDataEntity } from '../../domain/userAccountData.entity';
import { UserEmailDataEntity } from '../../domain/userEmailData.entity';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';
import { UsersRepository } from '../../infrastructure/users.repository';

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

    const userId = await this.usersRepository.save(createdUserDataDto);

    const createdEmailDataDto = new UserEmailDataEntity();
    createdEmailDataDto.userId = userId;
    createdEmailDataDto.confirmationCode = uuidv4();
    createdEmailDataDto.expirationDate = add(createdAt, {
      hours: 1,
      minutes: 3,
    });
    createdEmailDataDto.isConfirmed = true;
    await this.usersRepository.save(createdEmailDataDto);

    return userId;
  }
}
