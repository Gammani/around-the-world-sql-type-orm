import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizQuestionEntity } from './questions.entity';
import { GameEntity } from './game.entity';

@Entity({ name: 'game-questions' })
export class GameQuestionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  index: number;

  @Column({ nullable: false, type: 'uuid' })
  gameId: string;

  @ManyToOne(
    () => QuizQuestionEntity,
    (quizQuestion) => quizQuestion.gameQuestion,
  )
  @JoinColumn()
  question: QuizQuestionEntity;
  @Column('uuid')
  questionId: string;

  @ManyToOne(() => GameEntity)
  game: GameEntity;
}
