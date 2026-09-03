import { CreateExpenseDto } from './create-expense.dto';

class UpdateExpenseDto implements Omit<CreateExpenseDto, 'expenseCycleId' | '__brand'> {
  declare readonly __brand: symbol & { __brand: 'UpdateExpenseDto' };

  readonly description: string;

  readonly date: Date;

  readonly isProportional: boolean;

  readonly valueInCents: number;

  readonly paidByUserId: number;

  readonly sharedBetweenIds: number[];

  readonly tagIds: number[];

  constructor(data: {
    description: string;
    date: string;
    isProportional: boolean;
    valueInCents: number;
    paidByUserId: number;
    sharedBetweenIds: number[];
    tagIds: number[];
  }) {
    this.description = data.description;
    this.date = new Date(data.date);
    this.isProportional = data.isProportional;
    this.valueInCents = data.valueInCents;
    this.paidByUserId = data.paidByUserId;
    this.sharedBetweenIds = data.sharedBetweenIds;
    this.tagIds = data.tagIds;
  }
}

export { UpdateExpenseDto };
