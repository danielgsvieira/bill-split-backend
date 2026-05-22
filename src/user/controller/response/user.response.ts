import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

class UserResponse {
  declare readonly __brand: symbol & { __brand: 'UserResponse' };

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

  static fromEntity(entity: User): UserResponse;
  static fromEntity(entities: User[]): UserResponse[];
  static fromEntity(data: User | User[]): UserResponse | UserResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => UserResponse.fromEntity(el));
    }

    return new UserResponse(data);
  }
}

export { UserResponse };
