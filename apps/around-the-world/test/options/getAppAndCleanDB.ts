import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply-app-setting';
import { DataSource } from 'typeorm';
import supertest, { SuperAgentTest } from 'supertest';

export const getAppAndCleanDB = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  applyAppSettings(app);
  const agent: SuperAgentTest = supertest.agent(app.getHttpServer());
  await app.init();
  await agent.delete('/testing/all-data');

  // const dataSource = await app.resolve(DataSource);
  // await dataSource.query(`CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
  // DECLARE
  //     statements CURSOR FOR
  //         SELECT tablename FROM pg_tables
  //         WHERE tableowner = username AND schemaname = 'public';
  // BEGIN
  //     FOR stmt IN statements LOOP
  //         EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
  //     END LOOP;
  // END;
  // $$ LANGUAGE plpgsql;
  //
  // SELECT truncate_tables('postgres');
  // `);

  return {
    app: app,
    agent: agent,
  };
};
