import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccountDataEntity } from '../../../super-admin/users/domain/userAccountData.entity';

@Entity({ name: 'device' })
export class DeviceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  ip: string;

  @Column({ nullable: false })
  deviceName: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActiveDate: Date;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => UserAccountDataEntity)
  @JoinColumn()
  user: UserAccountDataEntity;
}
