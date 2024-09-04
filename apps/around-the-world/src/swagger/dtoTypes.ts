import { ApiProperty } from '@nestjs/swagger';
import { LikeStatus } from '../infrastructure/helpres/types';

export class UserInfoDTO {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'username123' })
  login: string;

  @ApiProperty({ example: '12345' })
  userId: string;
}

// query params
export class SearchNameTermDTO {
  @ApiProperty({
    default: null,
    required: false,
    description:
      'Search term for blog Name: Name should contains this term in any position',
  })
  searchNameTerm: string;
}

export class SearchLoginTermDTO {
  @ApiProperty({
    default: null,
    required: false,
    description:
      'Search term for user Login: Login should contains this term in any position',
  })
  searchLoginTerm: string;
}

export class SearchEmailTermDTO {
  @ApiProperty({
    default: null,
    required: false,
    description:
      'Search term for user Email: Email should contains this term in any position',
  })
  searchEmailTerm: string;
}

export class BodySearchTermDTO {
  @ApiProperty({
    default: null,
    required: false,
  })
  bodySearchTerm: string;
}

export class PublishedStatusDTO {
  @ApiProperty({
    default: 'all',
    required: false,
    enum: ['all', 'published', 'notPublished'],
  })
  publishedStatus: string;
}

export class SortByDTO {
  @ApiProperty({ default: 'createdAt', required: false })
  sortBy: string;
}

export class SortDirectionDTO {
  @ApiProperty({ default: 'desc', required: false, enum: ['asc', 'desc'] })
  sortDirection: string;
}

export class PageNumberDTO {
  @ApiProperty({
    default: 1,
    required: false,
    description: 'pageNumber is the number of portions that should be returned',
  })
  pageNumber: number;
}

export class PageSizeDTO {
  @ApiProperty({
    default: 10,
    required: false,
    description: 'pageSize is the size of portions that should be returned',
  })
  pageSize: number;
}

export class BlogIdDTO {
  @ApiProperty({
    required: true,
  })
  blogId: string;
}
export class PostIdDTO {
  @ApiProperty({
    required: true,
  })
  postId: string;
}

// user
export class UserDTO {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ example: 'string' })
  login: string;
  @ApiProperty({ example: 'string' })
  email: string;
  @ApiProperty({ example: '2024-08-28T13:52:58.823Z' })
  createdAt: string;
}

export class UserWithPaginationViewModelDTO {
  @ApiProperty({ example: 0 })
  pageCount: number;
  @ApiProperty({ example: 0 })
  page: number;
  @ApiProperty({ example: 0 })
  pageSize: number;
  @ApiProperty({ example: 0 })
  totalCount: number;
  @ApiProperty({ type: [UserDTO] })
  items: UserDTO;
}

// blog
export class BlogDTO {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ example: 'string' })
  name: string;
  @ApiProperty({ example: 'string' })
  description: string;
  @ApiProperty({ example: 'string' })
  websiteUrl: string;
  @ApiProperty({ example: '2024-08-28T13:52:58.823Z' })
  createdAt: string;
  @ApiProperty({ example: true })
  isMembership: boolean;
}

export class NewestLikesDTO {
  @ApiProperty({ example: '2024-08-29T04:44:57.801Z' })
  addedAt: string;
  @ApiProperty({ example: 'string' })
  userId: string;
  @ApiProperty({ example: 'string' })
  login: string;
}

export class ExtendedLikesInfoDTO {
  @ApiProperty({ example: 0 })
  likesCount: number;
  @ApiProperty({ example: 0 })
  dislikesCount: number;
  @ApiProperty({ example: 'None' })
  myStatus: LikeStatus;
  @ApiProperty({ type: [NewestLikesDTO] })
  newestLikes: NewestLikesDTO;
}

// quiz questions

export class QuizQuestionDTO {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ example: 'string' })
  body: string;
  @ApiProperty({ type: [String] })
  correctAnswers: string[];
  @ApiProperty({ example: false })
  published: boolean;
  @ApiProperty({ example: '2024-09-01T13:33:52.259Z' })
  createdAt: string;
  @ApiProperty({ example: '2024-09-01T13:33:52.259Z' })
  updatedAt: string;
}

export class QuizQuestionsViewModelDTO {
  @ApiProperty({ example: 0 })
  pageCount: number;
  @ApiProperty({ example: 0 })
  page: number;
  @ApiProperty({ example: 0 })
  pageSize: number;
  @ApiProperty({ example: 0 })
  totalCount: number;
  @ApiProperty({ type: [QuizQuestionDTO] })
  items: QuizQuestionDTO;
}

// post
export class PostViewModelDTO {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ example: 'string' })
  title: string;
  @ApiProperty({ example: 'string' })
  shortDescription: string;
  @ApiProperty({ example: 'string' })
  content: string;
  @ApiProperty({ example: '2024-08-28T13:52:58.823Z' })
  blogId: string;
  @ApiProperty({ example: true })
  blogName: string;
  @ApiProperty({ example: true })
  createdAt: string;
  @ApiProperty({ example: ExtendedLikesInfoDTO })
  extendedLikesInfo: ExtendedLikesInfoDTO;
}
export class PostsWithPaginationViewModelDTO {
  @ApiProperty({ example: 0 })
  pageCount: number;
  @ApiProperty({ example: 0 })
  page: number;
  @ApiProperty({ example: 0 })
  pageSize: number;
  @ApiProperty({ example: 0 })
  totalCount: number;
  @ApiProperty({ type: [PostViewModelDTO] })
  items: PostViewModelDTO;
}

// view
export class BlogsWithPaginationViewModelDTO {
  @ApiProperty({ example: 0 })
  pageCount: number;
  @ApiProperty({ example: 0 })
  page: number;
  @ApiProperty({ example: 0 })
  pageSize: number;
  @ApiProperty({ example: 0 })
  totalCount: number;
  @ApiProperty({ type: [BlogDTO] })
  items: BlogDTO;
}

export class PostDTO {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ example: 'string' })
  title: string;
  @ApiProperty({ example: 'string' })
  shortDescription: string;
  @ApiProperty({ example: 'string' })
  content: string;
  @ApiProperty({ example: 'string' })
  blogId: string;
  @ApiProperty({ example: 'string' })
  blogName: string;
  @ApiProperty({ example: '2024-08-28T13:52:58.823Z' })
  createdAt: string;
  @ApiProperty({ example: ExtendedLikesInfoDTO })
  extendedLikesInfo: ExtendedLikesInfoDTO;
}

//comments
export class CommentatorInfoDTO {
  @ApiProperty({ example: 'string' })
  userId: string;
  @ApiProperty({ example: 'string' })
  userLogin: string;
}
export class CommentLikeDTO {
  @ApiProperty({ example: 0 })
  likesCount: number;
  @ApiProperty({ example: 0 })
  dislikesCount: number;
  @ApiProperty({ example: 'None' })
  myStatus: string;
}
export class CommentDTO {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ example: 'string' })
  content: string;
  @ApiProperty({ type: CommentatorInfoDTO })
  commentatorInfo: CommentatorInfoDTO;
  @ApiProperty({ example: '2024-09-02T14:52:07.296Z' })
  createdAt: string;
  @ApiProperty({ type: CommentLikeDTO })
  likesInfo: CommentLikeDTO;
}
export class CommentsWithPaginationViewModelDTO {
  @ApiProperty({ example: 0 })
  pageCount: number;
  @ApiProperty({ example: 0 })
  page: number;
  @ApiProperty({ example: 0 })
  pageSize: number;
  @ApiProperty({ example: 0 })
  totalCount: number;
  @ApiProperty({ type: [CommentDTO] })
  items: CommentDTO;
}

// quiz game
export class Answer {
  @ApiProperty({ example: 'string' })
  questionId: string;
  @ApiProperty({ example: 'Correct' })
  answerStatus: string;
  @ApiProperty({ example: '2024-09-02T11:55:33.576Z' })
  addedAt: string;
}
export class QuizPlayer {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ example: 'string' })
  login: string;
}

export class PlayerProgressInGame {
  @ApiProperty({ type: [Answer] })
  answers: Answer;
  @ApiProperty({ type: QuizPlayer })
  player: QuizPlayer;
  @ApiProperty({ example: 0 })
  score: number;
}

export class QuizGameViewModel {
  @ApiProperty({ example: 'string' })
  id: string;
  @ApiProperty({ type: PlayerProgressInGame })
  firstPlayerProgress: PlayerProgressInGame;
  @ApiProperty({ type: PlayerProgressInGame })
  secondPlayerProgress: PlayerProgressInGame;
  @ApiProperty({ example: 'PendingSecondPlayer' })
  status: string;
  @ApiProperty({ example: '2024-09-02T13:01:42.937Z' })
  pairCreatedDate: string;
  @ApiProperty({ example: '2024-09-02T13:01:42.937Z' })
  startGameDate: string;
  @ApiProperty({ example: '2024-09-02T13:01:42.937Z' })
  finishGameDate: string;
}

export class AnswerDTO {
  @ApiProperty({ example: 'string' })
  questionId: string;
  @ApiProperty({ example: 'Correct' })
  answerStatus: string;
  @ApiProperty({ example: '2024-09-02T13:16:56.403Z' })
  addedAt: string;
}

// deviceDTO
export class DeviceDTO {
  @ApiProperty({ example: 'string' })
  ip: string;
  @ApiProperty({ example: 'string' })
  title: string;
  @ApiProperty({ example: 'string' })
  lastActiveDate: string;
  @ApiProperty({ example: 'string' })
  deviceId: string;
}
