import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../infrastructure/quiz.repository';
import { QuestionInputModel } from '../../api/model/input/quiz.input.model';

export class UpdateQuestionCommand {
  constructor(
    public questionId: string,
    public questionInputModel: QuestionInputModel,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private quizRepo: QuizRepository) {}

  async execute(command: UpdateQuestionCommand): Promise<boolean> {
    return await this.quizRepo.updateQuestion(
      command.questionId,
      command.questionInputModel,
    );
  }
}
