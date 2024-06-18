import { BaseEntity, Column, Entity, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryColumn } from 'typeorm';
import { UserAccountDataEntity } from './userAccountData.entity';

@Entity({ name: 'userEmailData' })
export class UserEmailDataEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserAccountDataEntity)
  @JoinColumn({ name: 'id' })
  user: UserAccountDataEntity;

  @Column({ nullable: false })
  confirmationCode: string;

  @Column({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expirationDate: Date;

  @Column({ type: 'boolean' })
  isConfirmed: boolean;
}
