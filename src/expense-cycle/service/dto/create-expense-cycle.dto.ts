class CreateExpenseCycleDto {
  readonly title: string;

  readonly description: string | null;

  readonly startDate: Date;

  readonly endDate: Date;

  readonly userId: number;

  readonly sharedWithIds: number[] | null;

  constructor(data: {
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
    userId: number;
    sharedWithIds?: number[] | null;
  }) {
    this.title = data.title;
    this.description = data.description ?? null;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.userId = data.userId;
    this.sharedWithIds = data.sharedWithIds ?? null;
  }
}

export { CreateExpenseCycleDto };
