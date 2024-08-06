import { SuperAgentTest } from 'supertest';
import { HttpStatus } from '@nestjs/common';

export const createAndLoginUsers = async (
  countUsers: number,
  agent: SuperAgentTest,
) => {
  const tokens: any = [];

  for (let i = 1; i <= countUsers; i++) {
    const user = {
      login: `user${i}`,
      password: `password${i}`,
      email: `user${i}@mail.mail`,
    };

    await agent
      .post('/sa/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(user)
      .expect(HttpStatus.CREATED);

    const response = await agent
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('User-agent', `${i}`)
      .expect(HttpStatus.OK);

    tokens.push(response.body.accessToken);
  }
  return tokens;
};
