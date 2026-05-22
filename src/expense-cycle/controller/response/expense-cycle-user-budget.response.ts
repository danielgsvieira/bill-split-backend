import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCycleUserBudget } from 'src/expense-cycle/entity/expense-cycle-user-budget.entity';
import { ExpenseCycleUserResponse } from './expense-cycle-user.response';

class ExpenseCycleUserBudgetResponse {
  declare readonly __brand: symbol & { __brand: 'ExpenseCycleUserBudgetResponse' };

  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly valueInCents: number;

  @ApiProperty({ type: ExpenseCycleUserResponse })
  readonly user: ExpenseCycleUserResponse;

  constructor(data: { id: number; valueInCents: number; user: ExpenseCycleUserResponse }) {
    this.id = data.id;
    this.valueInCents = data.valueInCents;
    this.user = data.user;
  }

  static fromEntity(entity: ExpenseCycleUserBudget): ExpenseCycleUserBudgetResponse;
  static fromEntity(entities: ExpenseCycleUserBudget[]): ExpenseCycleUserBudgetResponse[];
  static fromEntity(
    data: ExpenseCycleUserBudget | ExpenseCycleUserBudget[],
  ): ExpenseCycleUserBudgetResponse | ExpenseCycleUserBudgetResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleUserBudgetResponse.fromEntity(el));
    }

    if (data.user === undefined) {
      throw data.getRelationNotLoadedError('user');
    }

    const user = ExpenseCycleUserResponse.fromEntity(data.user);

    return new ExpenseCycleUserBudgetResponse({ ...data, user });
  }
}

export { ExpenseCycleUserBudgetResponse };
