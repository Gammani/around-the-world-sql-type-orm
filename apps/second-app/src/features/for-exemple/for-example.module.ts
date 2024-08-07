import { Module } from '@nestjs/common';
import { ForExampleController } from './for-example.controller';
import { ForExampleRepo } from './for-example.repo';
import { PrismaModule } from '../../../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ForExampleController],
  providers: [ForExampleRepo],
  exports: [ForExampleRepo],
})
export class ForExampleModule {}
