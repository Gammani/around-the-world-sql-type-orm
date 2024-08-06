import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-setting';

export const initTestSettings = async (): Promise<{
  app: INestApplication;
}> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    // .overrideProvider(UsersQueryRepository)
    // .useValue({ getAll: () => true })
    .compile();

  const app = moduleFixture.createNestApplication();
  applyAppSettings(app);
  await app.init();

  return {
    app,
  };
};
