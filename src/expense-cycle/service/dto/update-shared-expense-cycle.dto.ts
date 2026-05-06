import { UpdateExpenseCycleDto } from './update-expense-cycle.dto';

class UpdateSharedExpenseCycleDto implements Omit<UpdateExpenseCycleDto, 'sharedWithIds'> {
  readonly title: string;

  readonly description: string | null;

  readonly startDate: Date;

  readonly endDate: Date;

  constructor(data: {
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
  }) {
    this.title = data.title;
    this.description = data.description ?? null;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
  }
}

export { UpdateSharedExpenseCycleDto };
