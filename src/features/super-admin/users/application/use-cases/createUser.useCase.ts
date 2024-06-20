import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserCreateModel } from '../../api/models/input/create-user.input.model';
import { ServiceUnavailableException } from '@nestjs/common';
import { PasswordAdapter } from '../../../../adapter/password.adapter';
import { EmailManager } from '../../../../adapter/email.manager';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserAccountDataEntity } from '../../domain/userAccountData.entity';
import { UserEmailDataEntity } from '../../domain/userEmailData.entity';
import { add } from 'date-fns/add';

export class CreateUserCommand {
  constructor(public inputUserModel: UserCreateModel) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUserCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordAdapter: PasswordAdapter,
    private emailManager: EmailManager,
  ) {}

  async execute(command: CreateUserCommand) {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      command.inputUserModel.password,
    );
    // const confirmationCode = uuidv4();
    // const createUser = {
    //   inputUserModel: command.inputUserModel,
    //   passwordHash: passwordHash,
    //   isConfirmed: false,
    //   confirmationCode: confirmationCode,
    // };
    //
    // const createdUser = await this.usersRepository.createUser(createUser);
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
    createdEmailDataDto.isConfirmed = false;
    await this.usersRepository.save(createdEmailDataDto);

    try {
      await this.emailManager.sendEmail(
        command.inputUserModel.email,
        command.inputUserModel.login,
        `\` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href="https://somesite.com/confirm-email?code=${createdEmailDataDto.confirmationCode}">complete registration</a>
 </p>\``,
      );
    } catch (error) {
      console.log(error);
      // await this.usersRepository.deleteUser(createdUser.id);
      throw new ServiceUnavailableException();
    }
    return userId;
  }
}
