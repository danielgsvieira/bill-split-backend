class CreateTagDto {
  declare readonly __brand: symbol & { __brand: 'CreateTagDto' };

  readonly description: string;

  readonly color: string;

  constructor(data: { description: string; color: string }) {
    this.description = data.description;
    this.color = data.color;
  }
}

export { CreateTagDto };
