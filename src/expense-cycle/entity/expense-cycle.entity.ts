import { BaseEntity } from 'src/core/BaseEntity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
class ExpenseCycle extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: String, nullable: true })
  description!: string | null;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.expenseCycles)
  @JoinColumn({ name: 'userId' })
  createdBy?: User;

  @ManyToMany(() => User, (user) => user.sharedExpenseCycles)
  @JoinTable({
    name: 'expense_cycle_share',
    joinColumn: { name: 'expenseCycleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  sharedWith?: User[];
}

export { ExpenseCycle };
