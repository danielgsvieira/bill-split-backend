import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/tag/entity/tag.entity';
import { TagCreatorResponse } from './tag-creator.response';

class TagResponse {
  declare readonly __brand: symbol & { __brand: 'TagResponse' };

  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  createdBy: TagCreatorResponse;

  constructor(data: {
    id: number;
    description: string;
    color: string;
    createdBy: TagCreatorResponse;
  }) {
    this.id = data.id;
    this.description = data.description;
    this.color = data.color;
    this.createdBy = data.createdBy;
  }

  static fromEntity(entity: Tag): TagResponse;
  static fromEntity(entities: Tag[]): TagResponse[];
  static fromEntity(data: Tag | Tag[]): TagResponse | TagResponse[] {
    if (Array.isArray(data)) {
      return data.map((el) => TagResponse.fromEntity(el));
    }

    if (data.createdBy === undefined) {
      throw data.getRelationNotLoadedError('createdBy');
    }
    const createdBy = TagCreatorResponse.fromEntity(data.createdBy);

    return new TagResponse({
      id: data.id,
      description: data.description,
      color: data.color,
      createdBy,
    });
  }
}

export { TagResponse };
