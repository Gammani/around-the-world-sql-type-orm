import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../public/auth/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { QuestionsWithPaginationViewModel } from './model/output/quiz.output.model';
import { QuizQueryRepository } from '../infrastructure/quiz.query.repository';
import {
  PublishedInputModel,
  PublishedStatusType,
  QuestionInputModel,
} from './model/input/quiz.input.model';
import { CreateQuestionCommand } from '../application/use-cases/createQuestion.useCase';
import { UpdateQuestionPublishCommand } from '../application/use-cases/updateQuestionPublish.useCase';
import { FoundQuestionIdCommand } from '../application/use-cases/foundQuestionId.useCase';
import { UpdateQuestionCommand } from '../application/use-cases/updateQuestion.useCase';
import { DeleteQuestionIdCommand } from '../application/use-cases/deleteQuestionId.useCase';
import { SwaggerGetAllQuestionsEndpoint } from '../../../../swagger/quizGame/sa/getAllQuestions';
import { SwaggerCreateQuestionEndpoint } from '../../../../swagger/quizGame/sa/createQuestion';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class QuizSController {
  constructor(
    private commandBus: CommandBus,
    private quizQueryRepo: QuizQueryRepository,
  ) {}

  @Get('')
  @SwaggerGetAllQuestionsEndpoint()
  async getAllQuestions(
    @Query()
    query: {
      bodySearchTerm: string | undefined;
      publishedStatus: PublishedStatusType;
      sortBy: string | undefined;
      sortDirection: string | undefined;
      pageNumber: string | undefined;
      pageSize: string | undefined;
    },
  ) {
    const foundQuestions: QuestionsWithPaginationViewModel =
      await this.quizQueryRepo.findAllQuestions(
        query.bodySearchTerm,
        query.publishedStatus,
        query.sortBy,
        query.sortDirection,
        query.pageNumber,
        query.pageSize,
      );

    return foundQuestions;
  }

  @Post('')
  @SwaggerCreateQuestionEndpoint()
  async createQuestion(@Body() inputQuestionModel: QuestionInputModel) {
    const questionId = await this.commandBus.execute(
      new CreateQuestionCommand(inputQuestionModel),
    );
    return await this.quizQueryRepo.getQuestionById(questionId);
  }

  @Put(':id')
  @HttpCode(204)
  async updateQuestion(
    @Param('id') questionId: string,
    @Body() questionInputModel: QuestionInputModel,
  ) {
    const foundQuestionId: string | null = await this.commandBus.execute(
      new FoundQuestionIdCommand(questionId),
    );
    if (foundQuestionId) {
      return await this.commandBus.execute(
        new UpdateQuestionCommand(foundQuestionId, questionInputModel),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @Put(':id/publish')
  @HttpCode(204)
  async publishQuestion(
    @Param('id') questionId: string,
    @Body() publishedInputModel: PublishedInputModel,
  ) {
    const foundQuestionId: string | null = await this.commandBus.execute(
      new FoundQuestionIdCommand(questionId),
    );
    if (foundQuestionId) {
      return await this.commandBus.execute(
        new UpdateQuestionPublishCommand(
          foundQuestionId,
          publishedInputModel.published,
        ),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteQuestion(@Param('id') questionId: string) {
    const foundQuestionId: string | null = await this.commandBus.execute(
      new FoundQuestionIdCommand(questionId),
    );
    if (foundQuestionId) {
      return await this.commandBus.execute(
        new DeleteQuestionIdCommand(questionId),
      );
    } else {
      throw new NotFoundException();
    }
  }
}
