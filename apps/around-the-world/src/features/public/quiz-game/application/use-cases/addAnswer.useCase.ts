import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../../../super-admin/quiz-game/infrastructure/quiz.repository';
import { CreateAnswerDtoType } from '../../../../super-admin/quiz-game/api/model/output/quiz.output.model';

export class AddAnswerCommand {
  constructor(
    public playerId: string,
    public answer: string,
  ) {}
}

@CommandHandler(AddAnswerCommand)
export class AddAnswerUseCase implements ICommandHandler<AddAnswerCommand> {
  constructor(private quizRepo: QuizRepository) {}

  async execute(command: AddAnswerCommand) {
    const answers = await this.quizRepo.getAllAnswersFromPlayerId(
      command.playerId,
    );

    // const createAnswer: CreateAnswerDtoType;
    console.log(answers);
    return answers;
  }
}
