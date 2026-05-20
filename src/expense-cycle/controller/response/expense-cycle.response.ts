import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
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

    const createdBy = ExpenseCycleUserResponse.fromEntity(data.createdBy);
    const sharedWith = ExpenseCycleUserResponse.fromEntity(data.sharedWith);

    return new ExpenseCycleResponse({
      ...data,
      createdBy,
      sharedWith,
    });
  }
}

export { ExpenseCycleResponse };
