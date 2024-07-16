import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestionEntity } from '../domain/question.entity';
import { Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { QuestionInputModel } from '../api/model/input/quiz.input.model';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectRepository(QuizQuestionEntity)
    private quizQuestionRepo: Repository<QuizQuestionEntity>,
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

  async save(entity: QuizQuestionEntity): Promise<string> {
    const result = await entity.save();
    return result.id;
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
}
