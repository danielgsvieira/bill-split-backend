import { CreateTagDto } from './create-tag.dto';

class UpdateTagDto implements Omit<CreateTagDto, '__brand'> {
  declare readonly __brand: symbol & { __brand: 'UpdateTagDto' };

  readonly description: string;

  readonly color: string;

  constructor(data: { description: string; color: string }) {
    this.description = data.description;
    this.color = data.color;
  }
}

export { UpdateTagDto as UpdateTagDto };
