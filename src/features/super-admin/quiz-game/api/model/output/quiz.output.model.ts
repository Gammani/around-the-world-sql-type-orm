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
