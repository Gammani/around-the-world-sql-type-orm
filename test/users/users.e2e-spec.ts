import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getAppAndCleanDB } from '../options/getAppAndCleanDB';

describe('users', () => {
  let app: INestApplication;
  //let blogs = []

  beforeAll(async () => {
    app = await getAppAndCleanDB();
  });

  it('Create [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/sa/users')
      .auth('admin', 'qwerty')
      .send({
        login: 'test',
        password: 'string',
        email: 'test@test.ok',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          id: expect.any(String),
          login: 'test',
          email: 'test@test.ok',
          createdAt: expect.any(String),
        });
      });
  });

  it('Get all users [GET /users]', () => {
    return request(app.getHttpServer())
      .get('/sa/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.items.length).toBe(1);
      });
  });

  // it('Get one user [GET /users/:id]', () => {
  //   return request(app.getHttpServer())
  //     .get('/users/2')
  //     .expect(200)
  //     .then(({ body }) => {
  //       expect(body).toBeDefined();
  //     });
  // });
  //
  // it('Delete one user [DELETE /users/:id]', () => {
  //   return request(app.getHttpServer()).delete('/users/1').expect(200);
  // });

  afterAll(async () => {
    await app.close();
  });
});
