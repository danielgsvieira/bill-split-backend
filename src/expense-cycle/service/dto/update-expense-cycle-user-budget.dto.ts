class UpdateExpenseCycleUserBudgetDto {
  declare readonly __brand: symbol & { __brand: 'UpdateExpenseCycleUserBudgetDto' };

  readonly id: number;

  readonly valueInCents: number;

  constructor(data: { id: number; valueInCents: number }) {
    this.id = data.id;
    this.valueInCents = data.valueInCents;
  }
}

export { UpdateExpenseCycleUserBudgetDto };
