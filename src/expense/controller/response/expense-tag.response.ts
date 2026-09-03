import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/tag/entity/tag.entity';

class ExpenseTagResponse {
  declare readonly __brand: symbol & { __brand: 'ExpenseTagResponse' };

  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly color: string;

  constructor(data: { id: number; description: string; color: string }) {
    this.id = data.id;
    this.description = data.description;
    this.color = data.color;
  }

  static fromEntity(entity: Tag): ExpenseTagResponse;
  static fromEntity(entities: Tag[]): ExpenseTagResponse[];
  static fromEntity(data: Tag | Tag[]): ExpenseTagResponse | ExpenseTagResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseTagResponse.fromEntity(el));
    }

    return new ExpenseTagResponse(data);
  }
}

export { ExpenseTagResponse };
