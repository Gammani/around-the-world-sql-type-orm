import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../application/auth.service';
import { ConfirmCodeModel } from './models/input/confirm.code.model';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import {
  AuthInputModel,
  RequestWithDeviceId,
  RequestWithUser,
} from './models/input/auth.input.model';
import { SecurityDevicesService } from '../../devices/application/security.devices.service';
import { JwtService } from '../application/jwt.service';
import { EmailInputModel } from './models/input/email.input.model';
import { NewPasswordModel } from './models/input/new.password.model';
import { CommandBus } from '@nestjs/cqrs';
import { ConfirmEmailCommand } from '../application/use-cases/confirmEmail.useCase';
import { UpdatePasswordCommand } from '../application/use-cases/updatePassword.useCase';
import { EmailPasswordRecoveryInputModel } from './models/input/email.passwordRecovery.input.model';
import { PasswordRecoveryCommand } from '../application/use-cases/passwordRecovery.useCase';
import { AddDeviceCommand } from '../../devices/application/use-cases/addDevice.useCase';
// import { AddExpiredRefreshTokenCommand } from '../../expiredToken/application/use-cases/addExpiredRefreshToken.useCase';
import { DeleteCurrentSessionByIdCommand } from '../../devices/application/use-cases/deleteCurrentSessionById.useCase';
import { CheckRefreshToken } from '../guards/jwt-refreshToken.guard';
import { CheckAccessToken } from '../guards/jwt-accessToken.guard';
import { FindAndUpdateDeviceAfterRefreshCommand } from '../../devices/application/use-cases/findAndUpdateDeviceAfterRefresh.useCase';
import { UsersService } from '../../../super-admin/users/application/users.service';
import { UserCreateModel } from '../../../super-admin/users/api/models/input/create-user.input.model';
import { CreateUserCommand } from '../../../super-admin/users/application/use-cases/createUser.useCase';
import { GetUserViewModelByDeviceIdCommand } from '../../../super-admin/users/application/use-cases/getUserViewModelByDeviceId.useCase';
import { RegistrationResendCodeCommand } from '../application/use-cases/registrationResendCode.useCase';
import { AddExpiredRefreshTokenCommand } from '../application/use-cases/addExpiredRefreshTokenUseCase';
import { SwaggerRegistrationEndpoint } from '../../../../swagger/auth/registration';
import { SwaggerRegistrationConfirmationEndpoint } from '../../../../swagger/auth/registrationConfirmaion';
import { SwaggerPasswordRecoveryEndpoint } from '../../../../swagger/auth/passwordRecovery';
import { SwaggerNewPasswordEndpoint } from '../../../../swagger/auth/newPassword';
import { SwaggerLoginEndpoint } from '../../../../swagger/auth/login';
import { SwaggerRefreshTokenEndpoint } from '../../../../swagger/auth/refreshToken';
import { SwaggerRegistrationEmailResendingEndpoint } from '../../../../swagger/auth/registrationEmailResending';
import { SwaggerLogoutEndpoint } from '../../../../swagger/auth/logout';
import { SwaggerMeEndpoint } from '../../../../swagger/auth/me';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('registration')
  @SwaggerRegistrationEndpoint()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() createUserModel: UserCreateModel) {
    return this.commandBus.execute(new CreateUserCommand(createUserModel));
  }

  @Post('registration-confirmation')
  @SwaggerRegistrationConfirmationEndpoint()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() confirmCodeModel: ConfirmCodeModel) {
    await this.commandBus.execute(new ConfirmEmailCommand(confirmCodeModel));
  }

  @Post('password-recovery')
  @SwaggerPasswordRecoveryEndpoint()
  @HttpCode(204)
  async passwordRecovery(
    @Body() emailPasswordRecoveryInputModel: EmailPasswordRecoveryInputModel,
  ) {
    await this.commandBus.execute(
      new PasswordRecoveryCommand(emailPasswordRecoveryInputModel),
    );
  }

  @Post('new-password')
  @SwaggerNewPasswordEndpoint()
  @HttpCode(204)
  async newPassword(@Body() newPasswordModel: NewPasswordModel) {
    await this.commandBus.execute(new UpdatePasswordCommand(newPasswordModel));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @SwaggerLoginEndpoint()
  @HttpCode(200)
  async login(
    @Body() authInputModel: AuthInputModel,
    @Ip()
    ip: string,
    @Headers('user-agent') deviceName: string,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceId: string = await this.commandBus.execute(
      new AddDeviceCommand(req.user, ip, deviceName),
    );
    const accessToken = await this.jwtService.createAccessJWT(deviceId);
    const refreshToken = await this.jwtService.createRefreshJWT(deviceId);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: accessToken };
  }

  @UseGuards(CheckRefreshToken)
  @Post('refresh-token')
  @SwaggerRefreshTokenEndpoint()
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request & RequestWithDeviceId,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.commandBus.execute(
      new AddExpiredRefreshTokenCommand(req.deviceId, req.cookies.refreshToken),
    );

    const accessToken = await this.jwtService.createAccessJWT(req.deviceId);
    const refreshToken = await this.jwtService.createRefreshJWT(req.deviceId);
    await this.commandBus.execute(
      new FindAndUpdateDeviceAfterRefreshCommand(req.deviceId),
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: accessToken };
  }

  @Post('registration-email-resending')
  @SwaggerRegistrationEmailResendingEndpoint()
  @HttpCode(204)
  async registrationEmailResending(@Body() emailInputModel: EmailInputModel) {
    await this.commandBus.execute(
      new RegistrationResendCodeCommand(emailInputModel),
    );
  }

  @UseGuards(CheckRefreshToken)
  @Post('logout')
  @SwaggerLogoutEndpoint()
  @HttpCode(204)
  async logout(
    @Req() req: Request & RequestWithDeviceId,
    @Res({ passthrough: true }) res: Response,
  ) {
    // await this.commandBus.execute(
    //   new AddExpiredRefreshTokenCommand(req.deviceId, req.cookies.refreshToken),
    // );
    await this.commandBus.execute(
      new DeleteCurrentSessionByIdCommand(req.deviceId.toString()),
    );
    res.cookie('refreshToken', '', { httpOnly: true, secure: true });
  }

  @UseGuards(CheckAccessToken)
  @Get('me')
  @SwaggerMeEndpoint()
  async me(@Req() req: Request & RequestWithDeviceId) {
    return await this.commandBus.execute(
      new GetUserViewModelByDeviceIdCommand(req.deviceId),
    );
  }
}
