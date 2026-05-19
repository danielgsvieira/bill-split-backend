import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { ExpenseCycleUserBudgetResponse } from './expense-cycle-user-budget.response';
import { ExpenseCycleUserResponse } from './expense-cycle-user.response';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ExpenseCycleResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

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

  @ApiProperty({ type: [ExpenseCycleUserBudgetResponse] })
  readonly budgets: ExpenseCycleUserBudgetResponse[];

  constructor(data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    createdBy: ExpenseCycleUserResponse;
    sharedWith: ExpenseCycleUserResponse[];
    budgets: ExpenseCycleUserBudgetResponse[];
  }) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.title = data.title;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.createdBy = data.createdBy;
    this.sharedWith = data.sharedWith;
    this.budgets = data.budgets;
  }

  static fromEntity(entity: ExpenseCycle): ExpenseCycleResponse;
  static fromEntity(entities: ExpenseCycle[]): ExpenseCycleResponse[];
  static fromEntity(
    data: ExpenseCycle | ExpenseCycle[],
  ): ExpenseCycleResponse | ExpenseCycleResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleResponse.fromEntity(el));
    }

    if (data.createdBy === undefined) {
      throw data.getRelationNotLoadedError('createdBy');
    }

    if (data.sharedWith === undefined) {
      throw data.getRelationNotLoadedError('sharedWith');
    }

    if (data.budgets === undefined) {
      throw data.getRelationNotLoadedError('budgets');
    }

    const createdBy = ExpenseCycleUserResponse.fromEntity(data.createdBy);
    const sharedWith = ExpenseCycleUserResponse.fromEntity(data.sharedWith);
    const budgets = ExpenseCycleUserBudgetResponse.fromEntity(data.budgets);

    return new ExpenseCycleResponse({
      ...data,
      createdBy,
      sharedWith,
      budgets,
    });
  }
}

export { ExpenseCycleResponse };
