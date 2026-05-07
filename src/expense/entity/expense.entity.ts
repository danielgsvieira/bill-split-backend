import { BaseEntity } from 'src/core/BaseEntity';
import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

type ExpenseRelations = 'expenseCycle' | 'paidBy' | 'sharedBetween';

@Entity()
class Expense extends BaseEntity<Expense, ExpenseRelations> {
  @Column()
  description!: string;

  @Column()
  date!: Date;

  @Column()
  isProportional!: boolean;

  @Column()
  valueInCents!: number;

  @Column()
  expenseCycleId!: number;

  @ManyToOne(() => ExpenseCycle, (ec) => ec.expenses)
  @JoinColumn({ name: 'expenseCycleId' })
  expenseCycle?: ExpenseCycle;

  @Column()
  paidByUserId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'paidByUserId' })
  paidBy?: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'expense_share',
    joinColumn: { name: 'expenseId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  sharedBetween?: User[];
}

export { Expense };
export type { ExpenseRelations };
