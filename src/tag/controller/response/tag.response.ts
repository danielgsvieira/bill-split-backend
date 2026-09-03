import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/tag/entity/tag.entity';

class TagResponse {
  declare readonly __brand: symbol & { __brand: 'TagResponse' };

  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;

  constructor(data: { id: number; description: string; color: string }) {
    this.id = data.id;
    this.description = data.description;
    this.color = data.color;
  }

  static fromEntity(entity: Tag): TagResponse;
  static fromEntity(entities: Tag[]): TagResponse[];
  static fromEntity(data: Tag | Tag[]): TagResponse | TagResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => TagResponse.fromEntity(el));
    }

    return new TagResponse({
      id: data.id,
      description: data.description,
      color: data.color,
    });
  }
}

export { TagResponse };
