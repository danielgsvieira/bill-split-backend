import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
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

  constructor(data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
  }) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.title = data.title;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
  }

  static fromEntity(entity: ExpenseCycle): ExpenseCycleResponse;
  static fromEntity(entities: ExpenseCycle[]): ExpenseCycleResponse[];
  static fromEntity(
    data: ExpenseCycle | ExpenseCycle[],
  ): ExpenseCycleResponse | ExpenseCycleResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleResponse.fromEntity(el));
    }

    return new ExpenseCycleResponse(data);
  }
}

export { ExpenseCycleResponse };
