import { UpdateExpenseCycleDto } from './update-expense-cycle.dto';

class UpdateSharedExpenseCycleDto implements Omit<UpdateExpenseCycleDto, 'sharedWithIds'> {
  readonly title: string;

  readonly description: string | null;

  readonly startDate: Date;

  readonly endDate: Date;

  readonly userId: number;

  constructor(data: {
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
    userId: number;
    sharedWithIds?: number[];
  }) {
    this.title = data.title;
    this.description = data.description ?? null;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.userId = data.userId;
  }
}

export { UpdateSharedExpenseCycleDto };
