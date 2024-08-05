import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccountDataEntity } from '../../users/domain/userAccountData.entity';
import { AnswersEntity } from './answers.entity';
import { GameEntity } from './game.entity';

@Entity({ name: 'player' })
export class PlayerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  score: number;

  @OneToOne(() => GameEntity, (game) => game.player_1)
  gameAsFirstPlayer: GameEntity;

  @OneToOne(() => GameEntity, (game) => game.player_2)
  gameAsSecondPlayer: GameEntity;

  @OneToMany(() => AnswersEntity, (answer) => answer.player)
  answers: AnswersEntity[];

  @ManyToOne(() => UserAccountDataEntity, (user) => user.player)
  @JoinColumn()
  user: UserAccountDataEntity;
  @Column()
  userId: string;
}
