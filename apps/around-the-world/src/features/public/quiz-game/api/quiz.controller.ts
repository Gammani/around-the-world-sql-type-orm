import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { QuizQueryRepository } from '../../../super-admin/quiz-game/infrastructure/quiz.query.repository';
import { Request } from 'express';
import { RequestWithDeviceId } from '../../auth/api/models/input/auth.input.model';
import { ConnectionGameCommand } from '../application/use-cases/connectionGame.useCase';
import { CheckAccessToken } from '../../auth/guards/jwt-accessToken.guard';
import { GetUserIdByDeviceIdCommand } from '../../../super-admin/users/application/use-cases/getUserIdByDeviceId.useCase';
import { GetPlayerIdByUserIdCommand } from '../../../super-admin/quiz-game/application/use-cases/getPlayerIdByUserId.useCase';
import { AddAnswerCommand } from '../application/use-cases/addAnswer.useCase';
import { GetActivePlayerIdCommand } from '../application/use-cases/getActivePlayerId.useCase';
import { SwaggerReturnCurrentUnfinishedGameEndpoint } from '../../../../swagger/quizGame/public/returnCurrentUnfinishedGame';
import { SwaggerFindGameByIdEndpoint } from '../../../../swagger/quizGame/public/findGameById';
import { SwaggerConnectionEndpoint } from '../../../../swagger/quizGame/public/connection';
import { SwaggerSendAnswerFromUserEndpoint } from '../../../../swagger/quizGame/public/sendAnswerFromUser';

@UseGuards(CheckAccessToken)
@Controller('pair-game-quiz/pairs')
export class QuizController {
  constructor(
    private commandBus: CommandBus,
    private quizQueryRepo: QuizQueryRepository,
  ) {}

  @Get('my-current')
  @SwaggerReturnCurrentUnfinishedGameEndpoint()
  async returnCurrentUnfinishedGame(@Req() req: Request & RequestWithDeviceId) {
    const userId = await this.commandBus.execute(
      new GetUserIdByDeviceIdCommand(req.deviceId),
    );
    if (userId) {
      const foundPlayerId = await this.commandBus.execute(
        new GetPlayerIdByUserIdCommand(userId),
      );
      if (foundPlayerId) {
        return await this.quizQueryRepo.getGameViewModelByPlayerId(
          foundPlayerId,
        );
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  @SwaggerFindGameByIdEndpoint()
  async findGameById(@Param('id') gameId: string) {
    return await this.quizQueryRepo.getGameViewModelByGameId(gameId);
  }

  @Post('connection')
  @SwaggerConnectionEndpoint()
  async Connection(@Req() req: Request & RequestWithDeviceId) {
    const foundUserId = await this.commandBus.execute(
      new GetUserIdByDeviceIdCommand(req.deviceId),
    );
    if (foundUserId) {
      const playerId: string | null = await this.commandBus.execute(
        new ConnectionGameCommand(foundUserId),
      );
      if (playerId) {
        return await this.quizQueryRepo.getGameViewModelByPlayerId(playerId);
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new ForbiddenException();
    }
  }

  @Post('my-current/answers')
  @SwaggerSendAnswerFromUserEndpoint()
  async sendAnswerFromUser(
    @Req() req: Request & RequestWithDeviceId,
    @Body() answer: string,
  ) {
    const foundUserId = await this.commandBus.execute(
      new GetUserIdByDeviceIdCommand(req.deviceId),
    );
    if (foundUserId) {
      const playerId = await this.commandBus.execute(
        new GetActivePlayerIdCommand(foundUserId),
      );
      if (playerId) {
        return await this.commandBus.execute(
          new AddAnswerCommand(playerId, answer),
        );
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new ForbiddenException();
    }
  }
}
