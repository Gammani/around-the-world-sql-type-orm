import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../infrastructure/quiz.repository';

export class FoundQuestionIdCommand {
  constructor(public questionId: string) {}
}

@CommandHandler(FoundQuestionIdCommand)
export class FoundQuestionIdUseCase
  implements ICommandHandler<FoundQuestionIdCommand>
{
  constructor(private quizRepo: QuizRepository) {}

  async execute(command: FoundQuestionIdCommand): Promise<string | null> {
    return await this.quizRepo.foundQuestionIdById(command.questionId);
  }
}
