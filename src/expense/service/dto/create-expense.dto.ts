class CreateExpenseDto {
  readonly description: string;

  readonly date: Date;

  readonly isProportional: boolean;

  readonly valueInCents: number;

  readonly expenseCycleId: number;

  readonly paidByUserId: number;

  readonly sharedBetweenIds: number[];

  constructor(data: {
    description: string;
    date: string;
    isProportional: boolean;
    valueInCents: number;
    expenseCycleId: number;
    paidByUserId: number;
    sharedBetweenIds: number[];
  }) {
    this.description = data.description;
    this.date = new Date(data.date);
    this.isProportional = data.isProportional;
    this.valueInCents = data.valueInCents;
    this.expenseCycleId = data.expenseCycleId;
    this.paidByUserId = data.paidByUserId;
    this.sharedBetweenIds = data.sharedBetweenIds;
  }
}

export { CreateExpenseDto };
