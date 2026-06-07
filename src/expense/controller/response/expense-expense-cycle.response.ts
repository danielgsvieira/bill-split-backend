import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';

class ExpenseExpenseCycleResponse {
  declare readonly __brand: symbol & { __brand: 'ExpenseExpenseCycleResponse' };

  @ApiProperty()
  readonly id: number;

  constructor(data: { id: number }) {
    this.id = data.id;
  }

  static fromEntity(entity: ExpenseCycle): ExpenseExpenseCycleResponse;
  static fromEntity(entities: ExpenseCycle[]): ExpenseExpenseCycleResponse[];
  static fromEntity(
    data: ExpenseCycle | ExpenseCycle[],
  ): ExpenseExpenseCycleResponse | ExpenseExpenseCycleResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseExpenseCycleResponse.fromEntity(el));
    }

    return new ExpenseExpenseCycleResponse(data);
  }
}

export { ExpenseExpenseCycleResponse };
