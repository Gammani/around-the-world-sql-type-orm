import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../infrastructure/quiz.repository';

export class GetPlayerIdByUserIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetPlayerIdByUserIdCommand)
export class GetPlayerIdByUserIdUseCase
  implements ICommandHandler<GetPlayerIdByUserIdCommand>
{
  constructor(private quizRepo: QuizRepository) {}
  async execute(command: GetPlayerIdByUserIdCommand): Promise<string | null> {
    return await this.quizRepo.findPlayerIdByUserId(command.userId);
  }
}
