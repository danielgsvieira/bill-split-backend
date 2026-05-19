import { BaseEntity } from 'src/core/BaseEntity';
import { ExpenseCycle } from './expense-cycle.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

type ExpenseCycleUserBudgetRelations = 'user' | 'expenseCycle';

@Entity()
class ExpenseCycleUserBudget extends BaseEntity<
  ExpenseCycleUserBudget,
  ExpenseCycleUserBudgetRelations
> {
  @Column()
  valueInCents!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  expenseCycleId!: number;

  @ManyToOne(() => ExpenseCycle)
  @JoinColumn({ name: 'expenseCycleId' })
  expenseCycle?: ExpenseCycle;
}

export { ExpenseCycleUserBudget };
export type { ExpenseCycleUserBudgetRelations };
