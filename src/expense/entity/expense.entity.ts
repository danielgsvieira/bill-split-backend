import { BaseEntity } from 'src/core/BaseEntity';
import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

type ExpenseRelations = 'expenseCycle' | 'paidBy' | 'sharedBetween';

@Entity()
class Expense extends BaseEntity<Expense, ExpenseRelations> {
  declare readonly __brand: symbol & { __brand: 'Expense' };

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

  @ManyToOne(() => ExpenseCycle, (ec) => ec.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expenseCycleId' })
  expenseCycle?: ExpenseCycle;

  @Column()
  paidByUserId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'paidByUserId' })
  paidBy?: User;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'expense_share',
    joinColumn: { name: 'expenseId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  sharedBetween?: User[];

  constructor(data?: {
    description: string;
    date: Date;
    isProportional: boolean;
    valueInCents: number;
    expenseCycleId: number;
    paidByUserId: number;
  }) {
    super();

    if (data !== undefined) {
      this.description = data.description;
      this.date = data.date;
      this.isProportional = data.isProportional;
      this.valueInCents = data.valueInCents;
      this.expenseCycleId = data.expenseCycleId;
      this.paidByUserId = data.paidByUserId;
    }
  }
}

export { Expense };
export type { ExpenseRelations };
