import { Module } from '@nestjs/common';
import { SecondAppController } from './second-app.controller';
import { SecondAppService } from './second-app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from '../../around-the-world/src/settings/configuration/options';
import { CqrsModule } from '@nestjs/cqrs';
import { configModule } from '../../around-the-world/src/settings/configuration/configModule';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ForExampleModule } from './features/for-exemple/for-example.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    PrismaModule,
    CqrsModule,
    configModule,
    ForExampleModule,
  ],
  controllers: [SecondAppController],
  providers: [SecondAppService],
})
export class SecondAppModule {}
