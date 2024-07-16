import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../infrastructure/quiz.repository';

export class DeleteQuestionIdCommand {
  constructor(public questionId: string) {}
}

@CommandHandler(DeleteQuestionIdCommand)
export class DeleteQuestionIdUseCase
  implements ICommandHandler<DeleteQuestionIdCommand>
{
  constructor(private quizRepo: QuizRepository) {}

  async execute(command: DeleteQuestionIdCommand): Promise<boolean> {
    return await this.quizRepo.deleteQuestionId(command.questionId);
  }
}
