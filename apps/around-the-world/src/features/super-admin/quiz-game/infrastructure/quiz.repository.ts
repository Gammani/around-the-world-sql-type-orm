import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionEntity } from '../domain/questions.entity';
import { Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { QuestionInputModel } from '../api/model/input/quiz.input.model';
import { GameQuestionsEntity } from '../domain/game.questions.entity';
import { PlayerEntity } from '../domain/player.entity';
import { GameEntity } from '../domain/game.entity';
import { GameStatus } from '../../../../infrastructure/helpres/types';
import { AnswersEntity } from '../domain/answers.entity';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectRepository(QuizQuestionEntity)
    private quizQuestionRepo: Repository<QuizQuestionEntity>,
    @InjectRepository(GameQuestionsEntity)
    private gameQuestionRepo: Repository<GameQuestionsEntity>,
    @InjectRepository(GameEntity)
    private gameRepo: Repository<GameEntity>,
    @InjectRepository(PlayerEntity)
    private playerRepo: Repository<PlayerEntity>,
    @InjectRepository(AnswersEntity)
    private answersRepo: Repository<AnswersEntity>,
  ) {}

  async foundQuestionIdById(questionId: string): Promise<string | null> {
    if (validateUUID(questionId)) {
      const foundQuestion = await this.quizQuestionRepo
        .createQueryBuilder('q')
        .where('q.id = :questionId', { questionId })
        .getOne();
      if (foundQuestion) {
        return foundQuestion.id;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async getPrepareQuestions(gameId: string) {
    const foundQuestions = await this.gameQuestionRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.question', 'question')
      .where('q.gameId = :gameId', { gameId })
      .orderBy('q.index', 'ASC')
      .getMany();

    return foundQuestions;
  }

  async getAllAnswersFromPlayerId(playerId: string) {
    const foundAnswers = await this.answersRepo
      .createQueryBuilder('answers')
      .where('answers.playerId = :playerId', { playerId })
      .orderBy('answers.index', 'ASC')
      .getMany();
    return foundAnswers;
  }

  async updateQuestion(
    questionId: string,
    questionInputModel: QuestionInputModel,
  ): Promise<boolean> {
    const result = await this.quizQuestionRepo
      .createQueryBuilder()
      .update()
      .set({
        body: questionInputModel.body,
        correctAnswers: questionInputModel.correctAnswers,
      })
      .where('id = :questionId', { questionId })
      .execute();
    return result.affected === 1;
  }

  async findPlayerIdByUserId(userId: string): Promise<string | null> {
    const foundPlayer = await this.playerRepo
      .createQueryBuilder('player')
      .where('player.userId = :userId', { userId })
      .getOne();
    if (foundPlayer) {
      return foundPlayer.id;
    } else {
      return null;
    }
  }

  async updatePublishedQuestion(
    questionId: string,
    published: boolean,
  ): Promise<boolean> {
    const result = await this.quizQuestionRepo
      .createQueryBuilder()
      .update()
      .set({
        published: published,
      })
      .where('id = :questionId', { questionId })
      .execute();

    return result.affected === 1;
  }

  async deleteQuestionId(questionId: string): Promise<boolean> {
    const result = await this.quizQuestionRepo.delete({
      id: questionId,
    });
    return result.affected === 1;
  }

  async getRandomQuestions(limitQuestions: number) {
    const result = await this.quizQuestionRepo
      .createQueryBuilder('q')
      .select('q')
      .where(`q.published = true`)
      .orderBy(`RANDOM()`)
      .limit(limitQuestions)
      .getMany();

    return result;
  }

  async foundPlayerIdByPlayerIdInActiveOrPendingGame(
    userId: string,
  ): Promise<string | null> {
    const foundPlayer = await this.playerRepo
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.gameAsFirstPlayer', 'game1')
      .leftJoinAndSelect('player.gameAsSecondPlayer', 'game2')
      .where(
        '(game1.status = :activeStatus AND player.userId = :userId) OR (game2.status = :activeStatus AND player.userId = :userId) OR (game1.status = :pendingStatus AND player.userId = :userId) OR (game2.status = :pendingStatus AND player.userId = :userId)',
        {
          activeStatus: GameStatus.Active,
          pendingStatus: GameStatus.PendingSecondPlayer,
          userId: userId,
        },
      )
      .getMany();
    if (foundPlayer.length > 0) {
      return foundPlayer[0].id;
    } else {
      return null;
    }
  }
  async foundUserIdByPlayerIdInActiveGame(
    userId: string,
  ): Promise<string | null> {
    const foundPlayer = await this.playerRepo
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.gameAsFirstPlayer', 'game1')
      .leftJoinAndSelect('player.gameAsSecondPlayer', 'game2')
      .where(
        '(game1.status = :activeStatus AND player.userId = :userId) OR (game2.status = :activeStatus AND player.userId = :userId)',
        { activeStatus: GameStatus.Active, userId: userId },
      )
      .getMany();
    console.log(foundPlayer);
    if (foundPlayer.length > 0) {
      return foundPlayer[0].id;
    } else {
      return null;
    }
  }

  async foundGameWhereSecondUserNull(): Promise<string | null> {
    const foundGame = await this.gameRepo
      .createQueryBuilder('g')
      .where(`g.status = :status`, {
        status: 'PendingSecondPlayer',
      })
      .getOne();
    if (foundGame) {
      return foundGame.id;
    } else {
      return null;
    }
  }

  async updateStatusGame(playerId: string, gameId: string) {
    const result = await this.gameRepo
      .createQueryBuilder()
      .update()
      .set({ secondPlayerId: playerId, status: GameStatus.Active })
      .where('id = :gameId', { gameId })
      .execute();
    return result.affected === 1;
  }

  async save(
    entity:
      | QuizQuestionEntity
      | GameQuestionsEntity
      | PlayerEntity
      | GameEntity,
  ): Promise<string> {
    const result = await entity.save();
    return result.id;
  }

  async deleteAll() {
    await this.answersRepo.delete({});
    await this.gameQuestionRepo.delete({});
    await this.quizQuestionRepo.delete({});
    await this.gameRepo.delete({});
    await this.playerRepo.delete({});
  }
}
