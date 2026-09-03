import { Expense } from 'src/expense/entity/expense.entity';
import { ExpenseExpenseCycleResponse } from './expense-expense-cycle.response';
import { ExpenseTagResponse } from './expense-tag.response';
import { ExpenseUserResponse } from './expense-user.response';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ExpenseResponse {
  declare readonly __brand: symbol & { __brand: 'ExpenseResponse' };

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  isProportional: boolean;

  @ApiProperty()
  valueInCents: number;

  @ApiProperty({ type: ExpenseExpenseCycleResponse })
  expenseCycle: ExpenseExpenseCycleResponse;

  @ApiPropertyOptional({ type: ExpenseUserResponse })
  paidBy: ExpenseUserResponse;

  @ApiProperty({ type: [ExpenseUserResponse] })
  sharedBetween: ExpenseUserResponse[];

  @ApiProperty({ type: [ExpenseTagResponse] })
  tags: ExpenseTagResponse[];

  constructor(data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    date: Date;
    isProportional: boolean;
    valueInCents: number;
    expenseCycle: ExpenseExpenseCycleResponse;
    paidBy: ExpenseUserResponse;
    sharedBetween: ExpenseUserResponse[];
    tags: ExpenseTagResponse[];
  }) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.description = data.description;
    this.date = data.date;
    this.isProportional = data.isProportional;
    this.valueInCents = data.valueInCents;
    this.expenseCycle = data.expenseCycle;
    this.paidBy = data.paidBy;
    this.sharedBetween = data.sharedBetween;
    this.tags = data.tags;
  }

  static fromEntity(entity: Expense): ExpenseResponse;
  static fromEntity(entities: Expense[]): ExpenseResponse[];
  static fromEntity(data: Expense | Expense[]): ExpenseResponse | ExpenseResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseResponse.fromEntity(el));
    }

    if (data.expenseCycle === undefined) {
      throw data.getRelationNotLoadedError('expenseCycle');
    }
    const expenseCycle = ExpenseExpenseCycleResponse.fromEntity(data.expenseCycle);

    if (data.paidBy === undefined) {
      throw data.getRelationNotLoadedError('paidBy');
    }
    const paidBy = ExpenseUserResponse.fromEntity(data.paidBy);

    if (data.sharedBetween === undefined) {
      throw data.getRelationNotLoadedError('sharedBetween');
    }
    const sharedBetween = ExpenseUserResponse.fromEntity(data.sharedBetween);

    if (data.tags === undefined) {
      throw data.getRelationNotLoadedError('tags');
    }
    const tags = ExpenseTagResponse.fromEntity(data.tags);

    return new ExpenseResponse({
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      description: data.description,
      date: data.date,
      isProportional: data.isProportional,
      valueInCents: data.valueInCents,
      expenseCycle,
      paidBy,
      sharedBetween,
      tags,
    });
  }
}

export { ExpenseResponse };
