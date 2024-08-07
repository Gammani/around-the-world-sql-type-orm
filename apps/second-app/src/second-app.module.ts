import { Module } from '@nestjs/common';
import { SecondAppController } from './second-app.controller';
import { SecondAppService } from './second-app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from '../../around-the-world/src/settings/configuration/options';
import { CqrsModule } from '@nestjs/cqrs';
import { configModule } from '../../around-the-world/src/settings/configuration/configModule';

@Module({
  imports: [TypeOrmModule.forRoot(options), CqrsModule, configModule],
  controllers: [SecondAppController],
  providers: [SecondAppService],
})
export class SecondAppModule {}
