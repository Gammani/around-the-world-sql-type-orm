import { INestApplication } from '@nestjs/common';
import { getAppAndCleanDB } from '../options/getAppAndCleanDB';
import { SuperAgentTest } from 'supertest';
import { createAndLoginUsers } from '../functions/createAndLoginUsers';
import { createAndActiveQuestions } from '../functions/createAndActiveQuestions';

describe('test quiz game', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;
  let tokens: string[];

  beforeAll(async () => {
    const data = await getAppAndCleanDB();
    app = data.app;
    agent = data.agent;
  });

  it('should create and login user', async () => {
    tokens = await createAndLoginUsers(3, agent);
  });

  it('should created and active questions', async () => {
    await createAndActiveQuestions(6, agent);
  });

  afterAll(async () => {
    await app.close();
  });
});
