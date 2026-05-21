import { Expense } from 'src/expense/entity/expense.entity';
import { ExpenseCycleUserResponse } from './expense-cycle-user.response';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ExpenseCycleExpenseResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  isProportional: boolean;

  @ApiProperty()
  valueInCents: number;

  @ApiPropertyOptional({ type: ExpenseCycleUserResponse })
  paidBy: ExpenseCycleUserResponse;

  @ApiProperty({ type: [ExpenseCycleUserResponse] })
  sharedBetween: ExpenseCycleUserResponse[];

  constructor(data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    date: Date;
    isProportional: boolean;
    valueInCents: number;
    paidBy: ExpenseCycleUserResponse;
    sharedBetween: ExpenseCycleUserResponse[];
  }) {
    this.id = data.id;
    this.description = data.description;
    this.date = data.date;
    this.isProportional = data.isProportional;
    this.valueInCents = data.valueInCents;
    this.paidBy = data.paidBy;
    this.sharedBetween = data.sharedBetween;
  }

  static fromEntity(entity: Expense): ExpenseCycleExpenseResponse;
  static fromEntity(entities: Expense[]): ExpenseCycleExpenseResponse[];
  static fromEntity(
    data: Expense | Expense[],
  ): ExpenseCycleExpenseResponse | ExpenseCycleExpenseResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleExpenseResponse.fromEntity(el));
    }

    if (data.paidBy === undefined) {
      throw data.getRelationNotLoadedError('paidBy');
    }
    const paidBy = ExpenseCycleUserResponse.fromEntity(data.paidBy);

    if (data.sharedBetween === undefined) {
      throw data.getRelationNotLoadedError('sharedBetween');
    }
    const sharedBetween = ExpenseCycleUserResponse.fromEntity(data.sharedBetween);

    return new ExpenseCycleExpenseResponse({
      ...data,
      paidBy,
      sharedBetween,
    });
  }
}

export { ExpenseCycleExpenseResponse };
