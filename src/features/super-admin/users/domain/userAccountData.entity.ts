import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEmailDataEntity } from './userEmailData.entity';
import { DeviceEntity } from '../../../public/devices/domain/devices.entity';

@Entity({ name: 'userAccountData' })
export class UserAccountDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, collation: 'C' })
  login: string;
  @Column({ nullable: false, collation: 'C' })
  logins1: string;

  @Column({ nullable: false, collation: 'C' })
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

  @OneToOne(() => UserEmailDataEntity, (u) => u.user, {})
  userEmailData: UserEmailDataEntity;

  @OneToMany(() => DeviceEntity, (u) => u.userId, {})
  device: DeviceEntity;
}
