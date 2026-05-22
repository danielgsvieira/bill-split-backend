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
  declare readonly __brand: symbol & { __brand: 'ExpenseCycleUserBudget' };

  @Column()
  valueInCents!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  expenseCycleId!: number;

  @ManyToOne(() => ExpenseCycle, (ec) => ec.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expenseCycleId' })
  expenseCycle?: ExpenseCycle;

  constructor(data?: { valueInCents: number; userId: number; expenseCycleId: number }) {
    super();

    if (data !== undefined) {
      this.valueInCents = data.valueInCents;
      this.userId = data.userId;
      this.expenseCycleId = data.expenseCycleId;
    }
  }
}

export { ExpenseCycleUserBudget };
export type { ExpenseCycleUserBudgetRelations };
