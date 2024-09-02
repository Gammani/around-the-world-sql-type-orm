import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionEntity } from '../domain/questions.entity';
import { Repository } from 'typeorm';
import {
  GameViewModel,
  QuestionsWithPaginationViewModel,
  QuestionViewModel,
} from '../api/model/output/quiz.output.model';
import { sortedParamOptions } from '../../../../infrastructure/helpres/helpers';
import { PublishedStatusType } from '../api/model/input/quiz.input.model';
import { PaginationViewModel } from '../../../../infrastructure/helpres/pagination.view.mapper';
import { validate as validateUUID } from 'uuid';
import { GameEntity } from '../domain/game.entity';
import { GameQuestionsEntity } from '../domain/game.questions.entity';
import { GameStatus } from '../../../../infrastructure/helpres/types';
import { PlayerEntity } from '../domain/player.entity';
import { AnswersEntity } from '../domain/answers.entity';

@Injectable()
export class QuizQueryRepository {
  constructor(
    @InjectRepository(QuizQuestionEntity)
    private quizQuestionsRepo: Repository<QuizQuestionEntity>,
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

  async findAllQuestions(
    searchBodyTermQuery: string | undefined,
    publishedStatus: PublishedStatusType,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
  ): Promise<QuestionsWithPaginationViewModel> {
    const sortedOptions = sortedParamOptions(
      pageNumberQuery,
      pageSizeQuery,
      [],
      sortByQuery,
      sortDirectionQuery,
    );
    const searchBodyTerm = searchBodyTermQuery ? searchBodyTermQuery : '';

    let items;
    let totalCount;

    if (publishedStatus === 'published') {
      items = await this.quizQuestionsRepo
        .createQueryBuilder('q')
        .where(
          `LOWER(q.body) ILIKE :searchBodyTerm AND q.published = ${true}`,
          {
            searchBodyTerm: `%${searchBodyTerm}%`,
          },
        )
        .addOrderBy(sortedOptions.sortBy, sortedOptions.sortDirection)
        .limit(sortedOptions.pageSize)
        .offset(sortedOptions.offset)
        .getRawMany();

      totalCount = await this.quizQuestionsRepo
        .createQueryBuilder('q')
        .where(`q.published = ${true}`)
        .getCount();
    } else if (publishedStatus === 'notPublished') {
      items = await this.quizQuestionsRepo
        .createQueryBuilder('q')
        .where(
          `LOWER(q.body) ILIKE :searchBodyTerm AND q.published = ${false}`,
          {
            searchBodyTerm: `%${searchBodyTerm}%`,
          },
        )
        .addOrderBy(sortedOptions.sortBy, sortedOptions.sortDirection)
        .limit(sortedOptions.pageSize)
        .offset(sortedOptions.offset)
        .getRawMany();

      totalCount = await this.quizQuestionsRepo
        .createQueryBuilder('q')
        .where(`q.published = ${false}`)
        .getCount();
    } else {
      items = await this.quizQuestionsRepo
        .createQueryBuilder('q')
        .where(`LOWER(q.body) ILIKE :searchBodyTerm`, {
          searchBodyTerm: `%${searchBodyTerm}%`,
        })
        .addOrderBy(sortedOptions.sortBy, sortedOptions.sortDirection)
        .limit(sortedOptions.pageSize)
        .offset(sortedOptions.offset)
        .getRawMany();

      totalCount = await this.quizQuestionsRepo.createQueryBuilder().getCount();
    }

    return new PaginationViewModel(
      totalCount,
      sortedOptions.pageNumber,
      sortedOptions.pageSize,
      await this.getQuestionItemViewModel(items),
    );
  }

  async getQuestionById(questionId: string): Promise<QuestionViewModel | null> {
    if (validateUUID(questionId)) {
      const foundQuestion = await this.quizQuestionsRepo
        .createQueryBuilder('q')
        .where('q.id = :questionId', { questionId })
        .getOne();
      if (foundQuestion) {
        return {
          id: foundQuestion.id,
          body: foundQuestion.body,
          correctAnswers: foundQuestion.correctAnswers,
          published: foundQuestion.published,
          createdAt: foundQuestion.createdAt.toISOString(),
          updatedAt: foundQuestion.updatedAt.toISOString(),
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async getQuestionItemViewModel(items: any): Promise<QuestionViewModel[]> {
    return items.map((i) => {
      return {
        id: i.q_id,
        body: i.q_body,
        correctAnswers: i.q_correctAnswers,
        published: i.q_published,
        createdAt: i.q_createdAt.toISOString(),
        updatedAt: i.q_updatedAt.toISOString(),
      };
    });
  }

  async getGameViewModelByPlayerId(
    playerId: string,
  ): Promise<GameViewModel | any> {
    //находим игру с игроками и вопросами
    const foundGame = await this.gameRepo
      .createQueryBuilder('game')
      .where(
        '(game.firstPlayerId = :playerId AND game.status = :activeStatus) OR (game.secondPlayerId = :playerId AND game.status = :activeStatus) OR (game.firstPlayerId = :playerId AND game.status = :pendingStatus) OR (game.secondPlayerId = :playerId AND game.status = :pendingStatus)',
        {
          playerId,
          activeStatus: GameStatus.Active,
          pendingStatus: GameStatus.PendingSecondPlayer,
        },
      )
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.player_1', 'player1')
      .leftJoinAndSelect('game.player_2', 'player2')
      .getOne();
    // находим ответы игроков и самих игроков
    const player1 = await this.playerRepo
      .createQueryBuilder('player')
      .where('player.id = :id', { id: foundGame?.firstPlayerId })
      .leftJoinAndSelect('player.answers', 'answers')
      .leftJoinAndSelect('player.user', 'user')
      .getOne();

    const player2 = await this.playerRepo
      .createQueryBuilder('player')
      .where('player.id = :id', { id: foundGame?.secondPlayerId })
      .leftJoinAndSelect('player.answers', 'answers')
      .leftJoinAndSelect('player.user', 'user')
      .getOne();
    return {
      id: foundGame && foundGame.id,
      firstPlayerProgress: {
        answers: player1 ? player1.answers : [],
        player: {
          id: player1 ? player1.userId : null,
          login: player1 ? player1.user.login : null,
        },
        score: player1 ? player1.score : 0,
      },
      secondPlayerProgress: {
        answers: player2 ? player2.answers : [],
        player: {
          id: player2 ? player2.userId : null,
          login: player2 ? player2.user.login : null,
        },
        score: player2 ? player2.score : 0,
      },
      questions: foundGame && foundGame.questions,
      status: foundGame && foundGame.status,
      pairCreatedDate: '123',
      startGameDate: '123',
      finishGameDate: '123',
    };
  }

  async getGameViewModelByGameId(gameId: string): Promise<GameViewModel | any> {
    const foundGame = await this.gameRepo
      .createQueryBuilder('game')
      .where({
        id: gameId,
      })
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.player_1', 'player1')
      .leftJoinAndSelect('game.player_2', 'player2')
      .getOne();

    const player1 = await this.playerRepo
      .createQueryBuilder('player')
      .where('player.id = :id', { id: foundGame?.firstPlayerId })
      .leftJoinAndSelect('player.answers', 'answers')
      .leftJoinAndSelect('player.user', 'user')
      .getOne();

    const player2 = await this.playerRepo
      .createQueryBuilder('player')
      .where('player.id = :id', { id: foundGame?.secondPlayerId })
      .leftJoinAndSelect('player.answers', 'answers')
      .leftJoinAndSelect('player.user', 'user')
      .getOne();
    return {
      id: foundGame && foundGame.id,
      firstPlayerProgress: {
        answers: player1 ? player1.answers : [],
        player: {
          id: player1 ? player1.userId : null,
          login: player1 ? player1.user.login : null,
        },
        score: player1 ? player1.score : 0,
      },
      secondPlayerProgress: {
        answers: player2 ? player2.answers : [],
        player: {
          id: player2 ? player2.userId : null,
          login: player2 ? player2.user.login : null,
        },
        score: player2 ? player2.score : 0,
      },
      questions: foundGame && foundGame.questions,
      status: foundGame && foundGame.status,
      pairCreatedDate: '123',
      startGameDate: '123',
      finishGameDate: '123',
    };
  }
}
