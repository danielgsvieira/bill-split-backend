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
    startDate: string;
    endDate: string;
    sharedWithIds: number[];
  }) {
    this.title = data.title;
    this.description = data.description ?? null;
    this.startDate = new Date(data.startDate);
    this.endDate = new Date(data.endDate);
    this.sharedWithIds = data.sharedWithIds;
  }
}

export { UpdateExpenseCycleDto };
