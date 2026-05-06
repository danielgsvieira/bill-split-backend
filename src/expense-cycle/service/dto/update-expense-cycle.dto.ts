import { CreateExpenseCycleDto } from './create-expense-cycle.dto';

class UpdateExpenseCycleDto implements Omit<CreateExpenseCycleDto, 'userId' | 'sharedWithIds'> {
  readonly title: string;

  readonly description: string | null;

  readonly startDate: Date;

  readonly endDate: Date;

  readonly sharedWithIds: number[];

  constructor(data: {
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
    sharedWithIds: number[];
  }) {
    this.title = data.title;
    this.description = data.description ?? null;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.sharedWithIds = data.sharedWithIds;
  }
}

export { UpdateExpenseCycleDto };
