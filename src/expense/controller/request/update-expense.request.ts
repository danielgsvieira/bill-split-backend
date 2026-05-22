import { ApiProperty } from '@nestjs/swagger';
import { validationMessageFactory } from 'src/utils/validation';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  Length,
  Min,
} from 'class-validator';

class UpdateExpenseRequest {
  declare readonly __brand: symbol & { __brand: 'UpdateExpenseRequest' };

  @ApiProperty()
  @Length(1, 255, { message: validationMessageFactory.length })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  description!: string;

  @ApiProperty()
  @IsISO8601({ strict: true }, { message: validationMessageFactory.isISO8601 })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  date!: string;

  @ApiProperty()
  @IsBoolean({ message: validationMessageFactory.isBoolean })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  isProportional!: boolean;

  @ApiProperty()
  @Min(0, { message: validationMessageFactory.min })
  @IsInt({ message: validationMessageFactory.isInt })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  valueInCents!: number;

  @ApiProperty()
  @IsInt({ message: validationMessageFactory.isInt })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  paidByUserId!: number;

  @ApiProperty({ type: [Number] })
  @IsArray({ message: validationMessageFactory.isArray })
  @ArrayNotEmpty({ message: validationMessageFactory.arrayNotEmpty })
  @IsInt({ each: true, message: validationMessageFactory.isInt })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  sharedBetweenIds!: number[];
}

export { UpdateExpenseRequest };
