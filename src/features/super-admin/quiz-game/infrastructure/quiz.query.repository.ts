import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionEntity } from '../domain/question.entity';
import { Repository } from 'typeorm';
import {
  QuestionsWithPaginationViewModel,
  QuestionViewModel,
} from '../api/model/output/quiz.output.model';
import { sortedParamOptions } from '../../../../infrastructure/helpres/helpers';
import { PublishedStatusType } from '../api/model/input/quiz.input.model';
import { PaginationViewModel } from '../../../../infrastructure/helpres/pagination.view.mapper';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class QuizQueryRepository {
  constructor(
    @InjectRepository(QuizQuestionEntity)
    private quizQuestionsRepo: Repository<QuizQuestionEntity>,
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
}
