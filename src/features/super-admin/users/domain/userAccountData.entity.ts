import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEmailDataEntity } from './userEmailData.entity';

@Entity({ name: 'userAccountData' })
export class UserAccountDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: false })
  email: string;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  recoveryCode: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expirationDatePasswordRecovery: Date;

  @OneToOne(() => UserEmailDataEntity, (u) => u.user)
  userEmailData: UserEmailDataEntity;
}
