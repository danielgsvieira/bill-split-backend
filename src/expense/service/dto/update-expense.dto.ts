import { CreateExpenseDto } from './create-expense.dto';

class UpdateExpenseDto implements Omit<CreateExpenseDto, 'expenseCycleId'> {
  readonly description: string;

  readonly date: Date;

  readonly isProportional: boolean;

  readonly valueInCents: number;

  readonly paidByUserId: number;

  readonly sharedBetweenIds: number[];

  constructor(data: {
    description: string;
    date: string;
    isProportional: boolean;
    valueInCents: number;
    paidByUserId: number;
    sharedBetweenIds: number[];
  }) {
    this.description = data.description;
    this.date = new Date(data.date);
    this.isProportional = data.isProportional;
    this.valueInCents = data.valueInCents;
    this.paidByUserId = data.paidByUserId;
    this.sharedBetweenIds = data.sharedBetweenIds;
  }
}

export { UpdateExpenseDto };
