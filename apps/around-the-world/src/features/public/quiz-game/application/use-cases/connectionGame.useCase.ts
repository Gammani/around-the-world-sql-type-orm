import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../../../super-admin/quiz-game/infrastructure/quiz.repository';
import { GameQuestionsEntity } from '../../../../super-admin/quiz-game/domain/game.questions.entity';
import { PlayerEntity } from '../../../../super-admin/quiz-game/domain/player.entity';
import { GameEntity } from '../../../../super-admin/quiz-game/domain/game.entity';
import { GameStatus } from '../../../../../infrastructure/helpres/types';

export class ConnectionGameCommand {
  constructor(public userId: string) {}
}

@CommandHandler(ConnectionGameCommand)
export class ConnectionGameUseCase
  implements ICommandHandler<ConnectionGameCommand>
{
  constructor(private quizRepo: QuizRepository) {}
  async execute(command: ConnectionGameCommand) {
    // проверяем юзера на наличие активных/ожидающих игр
    const foundUser = await this.quizRepo.foundUserIdByPlayerIdInActiveGame(
      command.userId,
    );

    if (foundUser.length > 0) {
      return 'hello';
    } else {
      // проверяем, есть ли игра в стадии pending
      const foundGame: string | null =
        await this.quizRepo.foundGameWhereSecondUserNull();

      if (foundGame) {
        // создание сущности player
        const playerId = await this.createPlayer(command.userId);
        // добавление player в сущность game и меняем статус на Active
        await this.quizRepo.updateStatusGame(playerId, foundGame);

        // подготовка вопросов
        const limitQuestion = 5;

        // получаем вопросы с ответами
        const prepareQuestionsWithAnswers = await this.prepareQuestions(
          foundGame,
          limitQuestion,
        );
        return playerId;
      } else {
        // создание сущности player
        const playerId = await this.createPlayer(command.userId);

        // создание сущности game
        const gameId = await this.createGame(
          playerId,
          GameStatus.PendingSecondPlayer,
        );
        return playerId;
      }
    }
  }

  private async prepareQuestions(gameId: string, limitQuestion: number) {
    const rawQuestions = await this.quizRepo.getRandomQuestions(limitQuestion);

    for (let i = 0; i <= limitQuestion - 1; i++) {
      const gameQuestion = new GameQuestionsEntity();
      gameQuestion.gameId = gameId;
      gameQuestion.index = i;
      gameQuestion.questionId = rawQuestions[i].id;

      await this.quizRepo.save(gameQuestion);
    }

    return await this.quizRepo.getPrepareQuestions(gameId);
  }
  private async createPlayer(userId: string) {
    const player = new PlayerEntity();
    player.userId = userId;
    player.score = 0;
    player.answers = [];
    return await this.quizRepo.save(player);
  }

  private async createGame(playerId: string, gameStatus: GameStatus) {
    const game = new GameEntity();
    game.firstPlayerId = playerId;
    game.secondPlayerId = null;
    game.status = gameStatus;

    return await this.quizRepo.save(game);
  }
}
