import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

class ExpenseCycleUserResponse {
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

  static fromEntity(entity: User): ExpenseCycleUserResponse;
  static fromEntity(entities: User[]): ExpenseCycleUserResponse[];
  static fromEntity(data: User | User[]): ExpenseCycleUserResponse | ExpenseCycleUserResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => ExpenseCycleUserResponse.fromEntity(el));
    }

    return new ExpenseCycleUserResponse(data);
  }
}

export { ExpenseCycleUserResponse };
