import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './domain/question.entity';
import { QuizSController } from './api/quiz.sa.controller';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { QuizQueryRepository } from './infrastructure/quiz.query.repository';
import { CreateQuestionUseCase } from './application/use-cases/createQuestion.useCase';
import { QuizRepository } from './infrastructure/quiz.repository';
import { UpdateQuestionUseCase } from './application/use-cases/updateQuestion.useCase';
import { FoundQuestionIdUseCase } from './application/use-cases/foundQuestionId.useCase';
import { UpdateQuestionPublishUseCase } from './application/use-cases/updateQuestionPublish.useCase';
import { DeleteQuestionIdUseCase } from './application/use-cases/deleteQuestionId.useCase';

const useCases = [
  CreateQuestionUseCase,
  UpdateQuestionUseCase,
  FoundQuestionIdUseCase,
  UpdateQuestionPublishUseCase,
  DeleteQuestionIdUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestionEntity]), SharingModule],
  controllers: [QuizSController],
  providers: [QuizRepository, QuizQueryRepository, ...useCases],
  exports: [
    TypeOrmModule.forFeature([QuizQuestionEntity]),
    QuizQueryRepository,
    QuizRepository,
  ],
})
export class QuizGameModule {}
