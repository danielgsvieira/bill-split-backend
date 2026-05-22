import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

class ExpenseUserResponse {
  declare readonly __brand: symbol & { __brand: 'ExpenseUserResponse' };

  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly displayName: string;

  constructor(data: { id: number; username: string; displayName: string }) {
    this.id = data.id;
    this.username = data.username;
    this.displayName = data.displayName;
  }

  static fromEntity(entity: User): ExpenseUserResponse;
  static fromEntity(entities: User[]): ExpenseUserResponse[];
  static fromEntity(data: User | User[]): ExpenseUserResponse | ExpenseUserResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseUserResponse.fromEntity(el));
    }

    return new ExpenseUserResponse(data);
  }
}

export { ExpenseUserResponse };
