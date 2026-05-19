import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateExpenseCycleUserBudgetRequest } from './update-expense-cycle-user-budget.request';
import { validationMessageFactory } from 'src/utils/validation';
import { ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

class UpdateExpenseCycleUserBudgetsRequest {
  @ApiProperty({ type: [UpdateExpenseCycleUserBudgetRequest] })
  @ValidateNested({ each: true })
  @IsArray({ message: validationMessageFactory.isArray })
  @ArrayNotEmpty({ message: validationMessageFactory.arrayNotEmpty })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  @Type(() => UpdateExpenseCycleUserBudgetRequest)
  budgets!: UpdateExpenseCycleUserBudgetRequest[];
}

export { UpdateExpenseCycleUserBudgetsRequest };
