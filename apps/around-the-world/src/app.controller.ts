import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { SwaggerDefaultEndpoint } from './swagger/defoultEnpoint';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @SwaggerDefaultEndpoint()
  getHello(): string {
    console.log(this.configService.get('BLABLA'));
    return this.appService.getHello();
  }
}
