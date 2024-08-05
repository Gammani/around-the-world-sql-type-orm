import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameQuestionsEntity } from './game.questions.entity';

@Entity({ name: 'quiz-questions' })
export class QuizQuestionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, collation: 'C' })
  body: string;

  @Column({ nullable: false, type: 'jsonb' })
  correctAnswers: string[];

  @Column({ nullable: false, default: false })
  published: boolean;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @OneToMany(() => GameQuestionsEntity, () => GameQuestionsEntity)
  gameQuestion: GameQuestionsEntity;
}
