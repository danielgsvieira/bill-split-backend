import { UpdateExpenseCycleUserBudgetDto } from './update-expense-cycle-user-budget.dto';

class UpdateExpenseCycleUserBudgetsDto {
  readonly budgets: UpdateExpenseCycleUserBudgetDto[];

  constructor(data: { budgets: UpdateExpenseCycleUserBudgetDto[] }) {
    this.budgets = data.budgets;
  }
}

export { UpdateExpenseCycleUserBudgetsDto };
