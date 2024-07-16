import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../infrastructure/quiz.repository';

export class UpdateQuestionPublishCommand {
  constructor(
    public questionId: string,
    public published: boolean,
  ) {}
}

@CommandHandler(UpdateQuestionPublishCommand)
export class UpdateQuestionPublishUseCase
  implements ICommandHandler<UpdateQuestionPublishCommand>
{
  constructor(private quizRepo: QuizRepository) {}

  async execute(command: UpdateQuestionPublishCommand): Promise<boolean> {
    return await this.quizRepo.updatePublishedQuestion(
      command.questionId,
      command.published,
    );
  }
}
