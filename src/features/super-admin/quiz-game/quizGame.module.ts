import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionEntity } from './domain/questions.entity';
import { QuizSController } from './api/quiz.sa.controller';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { QuizQueryRepository } from './infrastructure/quiz.query.repository';
import { CreateQuestionUseCase } from './application/use-cases/createQuestion.useCase';
import { QuizRepository } from './infrastructure/quiz.repository';
import { UpdateQuestionUseCase } from './application/use-cases/updateQuestion.useCase';
import { FoundQuestionIdUseCase } from './application/use-cases/foundQuestionId.useCase';
import { UpdateQuestionPublishUseCase } from './application/use-cases/updateQuestionPublish.useCase';
import { DeleteQuestionIdUseCase } from './application/use-cases/deleteQuestionId.useCase';
import { QuizController } from '../../public/quiz-game/api/quiz.controller';
import { ConnectionGameUseCase } from '../../public/quiz-game/application/use-cases/connectionGame.useCase';
import { GameQuestionsEntity } from './domain/game.questions.entity';
import { PlayerEntity } from './domain/player.entity';
import { ExpiredTokenModule } from '../../public/expiredToken/expired.token.module';
import { AuthModule } from '../../public/auth/auth.module';
import { GetUserIdByDeviceIdUseCase } from '../users/application/use-cases/getUserIdByDeviceId.useCase';
import { SecurityDeviceModule } from '../../public/devices/sequrity.device.module';
import { AnswersEntity } from './domain/answers.entity';
import { GameEntity } from './domain/game.entity';
import { GetPlayerIdByUserIdUseCase } from './application/use-cases/getPlayerIdByUserId.useCase';

const useCases = [
  CreateQuestionUseCase,
  UpdateQuestionUseCase,
  FoundQuestionIdUseCase,
  UpdateQuestionPublishUseCase,
  DeleteQuestionIdUseCase,
  ConnectionGameUseCase,
  GetUserIdByDeviceIdUseCase,
  GetPlayerIdByUserIdUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizQuestionEntity,
      GameQuestionsEntity,
      PlayerEntity,
      AnswersEntity,
      GameEntity,
    ]),
    SharingModule,
    ExpiredTokenModule,
    AuthModule,
    SecurityDeviceModule,
  ],
  controllers: [QuizSController, QuizController],
  providers: [QuizRepository, QuizQueryRepository, ...useCases],
  exports: [
    TypeOrmModule.forFeature([
      QuizQuestionEntity,
      GameQuestionsEntity,
      PlayerEntity,
      AnswersEntity,
    ]),
    QuizQueryRepository,
    QuizRepository,
  ],
})
export class QuizGameModule {}
