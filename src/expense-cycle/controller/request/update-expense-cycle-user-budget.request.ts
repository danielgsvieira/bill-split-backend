import { ApiProperty } from '@nestjs/swagger';
import { validationMessageFactory } from 'src/utils/validation';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

class UpdateExpenseCycleUserBudgetRequest {
  @ApiProperty()
  @IsInt({ message: validationMessageFactory.isInt })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  id!: number;

  @ApiProperty()
  @IsInt({ message: validationMessageFactory.isInt })
  @Min(0, { message: validationMessageFactory.min })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  valueInCents!: number;
}

export { UpdateExpenseCycleUserBudgetRequest };
