import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { ExpenseCycleExpenseResponse } from './expense-cycle-expense.response';
import { ExpenseCycleUserBudgetResponse } from './expense-cycle-user-budget.response';
import { ExpenseCycleUserResponse } from './expense-cycle-user.response';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ExpenseCycleDetailsResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly title: string;

  @ApiPropertyOptional({ type: String })
  readonly description: string | null;

  @ApiProperty()
  readonly startDate: Date;

  @ApiProperty()
  readonly endDate: Date;

  @ApiProperty({ type: ExpenseCycleUserResponse })
  readonly createdBy: ExpenseCycleUserResponse;

  @ApiProperty({ type: [ExpenseCycleUserResponse] })
  readonly sharedWith: ExpenseCycleUserResponse[];

  @ApiProperty({ type: [ExpenseCycleExpenseResponse] })
  readonly expenses: ExpenseCycleExpenseResponse[];

  @ApiProperty({ type: [ExpenseCycleUserBudgetResponse] })
  readonly budgets: ExpenseCycleUserBudgetResponse[];

  constructor(data: {
    id: number;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    createdBy: ExpenseCycleUserResponse;
    expenses: ExpenseCycleExpenseResponse[];
    sharedWith: ExpenseCycleUserResponse[];
    budgets: ExpenseCycleUserBudgetResponse[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.createdBy = data.createdBy;
    this.sharedWith = data.sharedWith;
    this.expenses = data.expenses;
    this.budgets = data.budgets;
  }

  static fromEntity(entity: ExpenseCycle): ExpenseCycleDetailsResponse;
  static fromEntity(entities: ExpenseCycle[]): ExpenseCycleDetailsResponse[];
  static fromEntity(
    data: ExpenseCycle | ExpenseCycle[],
  ): ExpenseCycleDetailsResponse | ExpenseCycleDetailsResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleDetailsResponse.fromEntity(el));
    }

    if (data.createdBy === undefined) {
      throw data.getRelationNotLoadedError('createdBy');
    }
    const createdBy = ExpenseCycleUserResponse.fromEntity(data.createdBy);

    if (data.sharedWith === undefined) {
      throw data.getRelationNotLoadedError('sharedWith');
    }
    const sharedWith = ExpenseCycleUserResponse.fromEntity(data.sharedWith);

    if (data.expenses === undefined) {
      throw data.getRelationNotLoadedError('expenses');
    }
    const expenses = ExpenseCycleExpenseResponse.fromEntity(data.expenses);

    if (data.budgets === undefined) {
      throw data.getRelationNotLoadedError('budgets');
    }
    const budgets = ExpenseCycleUserBudgetResponse.fromEntity(data.budgets);

    return new ExpenseCycleDetailsResponse({
      ...data,
      budgets,
      createdBy,
      expenses,
      sharedWith,
    });
  }
}

export { ExpenseCycleDetailsResponse };
