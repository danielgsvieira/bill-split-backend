import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

class TagCreatorResponse {
  declare readonly __brand: symbol & { __brand: 'TagCreatorResponse' };

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

  static fromEntity(entity: User): TagCreatorResponse;
  static fromEntity(entities: User[]): TagCreatorResponse[];
  static fromEntity(data: User | User[]): TagCreatorResponse | TagCreatorResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => TagCreatorResponse.fromEntity(el));
    }

    return new TagCreatorResponse(data);
  }
}

export { TagCreatorResponse };
