import {
  AnswerStatus,
  GameStatus,
} from '../../../../../../infrastructure/helpres/types';

export type QuestionViewModel = {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionsWithPaginationViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: QuestionViewModel[];
};

type answersViewType = {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
};

type PlayerViewType = {
  id: string;
  login: string;
};

type QuestionViewType = {
  id: string;
  body: string;
};

export type GameViewModel = {
  id: string;
  firstPlayerProgress: {
    answers: answersViewType[];
    player: PlayerViewType;
    score: number;
  };
  secondPlayerProgress: {
    answers: answersViewType[];
    player: PlayerViewType;
    score: number;
  };
  questions: QuestionViewType[];
  status: GameStatus;
  pairCreatedDate: string;
  startGameDate: string;
  finishGameDate: string;
};
