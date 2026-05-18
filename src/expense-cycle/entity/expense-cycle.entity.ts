import { BaseEntity } from 'src/core/BaseEntity';
import { Expense } from 'src/expense/entity/expense.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

type ExpenseCycleRelations = 'createdBy' | 'sharedWith' | 'expenses';

@Entity()
class ExpenseCycle extends BaseEntity<ExpenseCycle, ExpenseCycleRelations> {
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

  @OneToMany(() => Expense, (expense) => expense.expenseCycleId)
  expenses?: Expense[];

  get users() {
    if (this.createdBy === undefined) {
      throw this.getRelationNotLoadedError('createdBy');
    }

    if (this.sharedWith === undefined) {
      throw this.getRelationNotLoadedError('sharedWith');
    }

    return [this.createdBy, ...this.sharedWith];
  }
}

export { ExpenseCycle };
export type { ExpenseCycleRelations };
