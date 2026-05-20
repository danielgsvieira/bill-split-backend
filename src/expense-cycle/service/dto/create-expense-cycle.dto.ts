class CreateExpenseCycleDto {
  readonly title: string;

  readonly description: string | null;

  readonly startDate: Date;

  readonly endDate: Date;

  readonly sharedWithIds: number[] | null;

  constructor(data: {
    title: string;
    description?: string | null;
    startDate: string;
    endDate: string;
    sharedWithIds?: number[] | null;
  }) {
    this.title = data.title;
    this.description = data.description ?? null;
    this.startDate = new Date(data.startDate);
    this.endDate = new Date(data.endDate);
    this.sharedWithIds = data.sharedWithIds ?? null;
  }
}

export { CreateExpenseCycleDto };
