import { QuestionInputModel } from '../../api/model/input/quiz.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../infrastructure/quiz.repository';
import { QuizQuestionEntity } from '../../domain/questions.entity';

export class CreateQuestionCommand {
  constructor(public inputQuestionModel: QuestionInputModel) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(private quizRepo: QuizRepository) {}

  async execute(command: CreateQuestionCommand): Promise<string> {
    const date = new Date();
    const createdQuestion = new QuizQuestionEntity();
    createdQuestion.body = command.inputQuestionModel.body;
    createdQuestion.correctAnswers = command.inputQuestionModel.correctAnswers;
    createdQuestion.published = false;
    createdQuestion.createdAt = date;
    createdQuestion.updatedAt = date;

    return await this.quizRepo.save(createdQuestion);
  }
}
