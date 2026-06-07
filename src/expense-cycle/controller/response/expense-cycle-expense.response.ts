import { ApiProperty } from '@nestjs/swagger';
import { Expense } from 'src/expense/entity/expense.entity';

class ExpenseCycleExpenseResponse {
  declare readonly __brand: symbol & { __brand: 'ExpenseCycleExpenseResponse' };

  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  userIds: number[];

  constructor(data: { id: number; date: Date; userIds: number[] }) {
    this.id = data.id;
    this.date = data.date;
    this.userIds = data.userIds;
  }

  static fromEntity(entity: Expense): ExpenseCycleExpenseResponse;
  static fromEntity(entities: Expense[]): ExpenseCycleExpenseResponse[];
  static fromEntity(
    data: Expense | Expense[],
  ): ExpenseCycleExpenseResponse | ExpenseCycleExpenseResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleExpenseResponse.fromEntity(el));
    }

    return new ExpenseCycleExpenseResponse(data);
  }
}

export { ExpenseCycleExpenseResponse };
