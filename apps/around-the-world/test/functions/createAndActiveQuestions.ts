import { SuperAgentTest } from 'supertest';
import { HttpStatus } from '@nestjs/common';

export const createAndActiveQuestions = async (
  countQuestions: number,
  agent: SuperAgentTest,
) => {
  for (let i = 1; i <= countQuestions; i++) {
    const questions = {
      body: `question of number ${i}`,
      correctAnswers: ['yes', 'да', '+'],
    };

    const response = await agent
      .post('/sa/quiz/questions')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(questions)
      .expect(HttpStatus.CREATED);

    await agent
      .put(`/sa/quiz/questions/${response.body.id}/publish`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send({
        published: true,
      })
      .expect(HttpStatus.NO_CONTENT);
  }
};
