import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameStatus } from '../../../../infrastructure/helpres/types';
import { PlayerEntity } from './player.entity';
import { GameQuestionsEntity } from './game.questions.entity';

@Entity({ name: 'game' })
export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.PendingSecondPlayer,
  })
  status: GameStatus;

  @OneToOne(() => PlayerEntity)
  @JoinColumn({ name: 'firstPlayerId' })
  player_1: PlayerEntity;
  @Column('uuid')
  firstPlayerId: string;

  @OneToOne(() => PlayerEntity)
  @JoinColumn({ name: 'secondPlayerId' })
  player_2: PlayerEntity;
  @Column({ type: 'uuid', nullable: true })
  secondPlayerId: string | null;

  @OneToMany(() => GameQuestionsEntity, (questions) => questions.game)
  questions: GameQuestionsEntity[] | null;
}
