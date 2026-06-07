import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { ExpenseCycleExpenseResponse } from './expense-cycle-expense.response';
import { ExpenseCycleUserResponse } from './expense-cycle-user.response';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ExpenseCycleDetailsResponse {
  declare readonly __brand: symbol & { __brand: 'ExpenseCycleDetailsResponse' };

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

  constructor(data: {
    id: number;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    createdBy: ExpenseCycleUserResponse;
    expenses: ExpenseCycleExpenseResponse[];
    sharedWith: ExpenseCycleUserResponse[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.createdBy = data.createdBy;
    this.sharedWith = data.sharedWith;
    this.expenses = data.expenses;
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

    return new ExpenseCycleDetailsResponse({
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      createdBy,
      expenses,
      sharedWith,
    });
  }
}

export { ExpenseCycleDetailsResponse };
