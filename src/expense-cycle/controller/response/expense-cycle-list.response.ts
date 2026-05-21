import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { ExpenseCycleUserResponse } from './expense-cycle-user.response';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ExpenseCycleListResponse {
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

  constructor(data: {
    id: number;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    createdBy: ExpenseCycleUserResponse;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.createdBy = data.createdBy;
  }

  static fromEntity(entity: ExpenseCycle): ExpenseCycleListResponse;
  static fromEntity(entities: ExpenseCycle[]): ExpenseCycleListResponse[];
  static fromEntity(
    data: ExpenseCycle | ExpenseCycle[],
  ): ExpenseCycleListResponse | ExpenseCycleListResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleListResponse.fromEntity(el));
    }

    if (data.createdBy === undefined) {
      throw data.getRelationNotLoadedError('createdBy');
    }
    const createdBy = ExpenseCycleUserResponse.fromEntity(data.createdBy);

    return new ExpenseCycleListResponse({
      ...data,
      createdBy,
    });
  }
}

export { ExpenseCycleListResponse };
