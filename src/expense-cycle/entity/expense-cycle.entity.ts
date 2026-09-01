import { BaseEntity } from 'src/core/BaseEntity';
import { Expense } from 'src/expense/entity/expense.entity';
import { ExpenseCycleUserBudget } from './expense-cycle-user-budget.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

type ExpenseCycleRelations = 'createdBy' | 'sharedWith' | 'expenses' | 'budgets';

@Entity()
class ExpenseCycle extends BaseEntity<ExpenseCycle, ExpenseCycleRelations> {
  declare readonly __brand: symbol & { __brand: 'ExpenseCycleEntity' };

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

  @OneToMany(() => Expense, (expense) => expense.expenseCycle)
  expenses?: Expense[];

  @OneToMany(() => ExpenseCycleUserBudget, (ecub) => ecub.expenseCycle)
  budgets?: ExpenseCycleUserBudget[];

  constructor(data?: {
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    userId: number;
  }) {
    super();

    if (data !== undefined) {
      this.title = data.title;
      this.description = data.description;
      this.startDate = data.startDate;
      this.endDate = data.endDate;
      this.userId = data.userId;
    }
  }

  get users() {
    if (this.createdBy === undefined) {
      throw this.getRelationNotLoadedError('createdBy');
    }

    if (this.sharedWith === undefined) {
      throw this.getRelationNotLoadedError('sharedWith');
    }

    return [this.createdBy, ...this.sharedWith];
  }

  /**
   * Return all ExpenseCycle related User ids
   */
  get userIds() {
    if (this.sharedWith === undefined) {
      throw this.getRelationNotLoadedError('sharedWith');
    }

    return [this.userId, ...this.sharedWith.map((el) => el.id)];
  }

  get budgetIds() {
    if (this.budgets === undefined) {
      throw this.getRelationNotLoadedError('budgets');
    }

    return this.budgets.map((el) => el.id);
  }
}

export { ExpenseCycle };
export type { ExpenseCycleRelations };
