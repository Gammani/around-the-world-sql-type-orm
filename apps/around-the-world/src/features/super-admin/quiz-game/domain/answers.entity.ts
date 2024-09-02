import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnswerStatus } from '../../../../infrastructure/helpres/types';
import { PlayerEntity } from './player.entity';

@Entity({ name: 'answers' })
export class AnswersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'enum', enum: AnswerStatus })
  status: AnswerStatus;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  addedAt: Date;

  @Column({ nullable: false })
  index: number;

  @ManyToOne(() => PlayerEntity, (player) => player.answers)
  @JoinColumn()
  player: PlayerEntity;

  @Column('uuid')
  playerId: string;
}
