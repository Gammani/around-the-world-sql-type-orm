import {
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
import {
  RequestWithDeviceId,
  RequestWithUserId,
} from '../../auth/api/models/input/auth.input.model';
import { ConnectionGameCommand } from '../application/use-cases/connectionGame.useCase';
import { CheckAccessToken } from '../../auth/guards/jwt-accessToken.guard';
import { GetUserIdByDeviceIdCommand } from '../../../super-admin/users/application/use-cases/getUserIdByDeviceId.useCase';
import { GetPlayerIdByUserIdCommand } from '../../../super-admin/quiz-game/application/use-cases/getPlayerIdByUserId.useCase';

@UseGuards(CheckAccessToken)
@Controller('pair-game-quiz/pairs')
export class QuizController {
  constructor(
    private commandBus: CommandBus,
    private quizQueryRepo: QuizQueryRepository,
  ) {}

  @Get('my-current')
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

  @Get('pairs/:id')
  async findGameById(
    @Param('id') gameId: string,
    @Req() req: Request & RequestWithUserId,
  ) {}

  @Post('connection')
  async Connection(@Req() req: Request & RequestWithDeviceId) {
    const foundUserId = await this.commandBus.execute(
      new GetUserIdByDeviceIdCommand(req.deviceId),
    );
    if (foundUserId) {
      const playerId = await this.commandBus.execute(
        new ConnectionGameCommand(foundUserId),
      );
      return await this.quizQueryRepo.getGameViewModelByPlayerId(playerId);
    } else {
      throw new ForbiddenException();
    }
  }
}
