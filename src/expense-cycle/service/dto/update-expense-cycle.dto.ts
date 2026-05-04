import { CreateExpenseCycleDto } from './create-expense-cycle.dto';

class UpdateExpenseCycleDto extends CreateExpenseCycleDto {
  readonly sharedWithIds: number[];

  constructor(data: {
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
    userId: number;
    sharedWithIds: number[];
  }) {
    super(data);

    this.sharedWithIds = data.sharedWithIds;
  }
}

export { UpdateExpenseCycleDto };
