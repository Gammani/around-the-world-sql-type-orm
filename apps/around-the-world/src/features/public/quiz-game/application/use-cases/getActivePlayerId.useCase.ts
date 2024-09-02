import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../../../super-admin/quiz-game/infrastructure/quiz.repository';

export class GetActivePlayerIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetActivePlayerIdCommand)
export class GetActivePlayerIdUseCase
  implements ICommandHandler<GetActivePlayerIdCommand>
{
  constructor(private quizRepo: QuizRepository) {}

  async execute(command: GetActivePlayerIdCommand) {
    // проверяем юзера на наличие активных игр
    const foundPlayerId: string | null =
      await this.quizRepo.foundUserIdByPlayerIdInActiveGame(command.userId);

    return foundPlayerId;
  }
}
