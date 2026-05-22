import { validationMessageFactory } from 'src/utils/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsISO8601, IsNotEmpty, IsOptional, Length } from 'class-validator';

class CreateExpenseCycleRequest {
  declare readonly __brand: symbol & { __brand: 'CreateExpenseCycleRequest' };

  @ApiProperty()
  @Length(1, 255, { message: validationMessageFactory.length })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  title!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Length(1, 3000, { message: validationMessageFactory.length })
  description?: string | null;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray({ message: validationMessageFactory.isArray })
  @IsInt({ each: true, message: validationMessageFactory.isInt })
  sharedWithIds?: number[] | null;

  @ApiProperty()
  @IsISO8601({ strict: true }, { message: validationMessageFactory.isISO8601 })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  startDate!: string;

  @ApiProperty()
  @IsISO8601({ strict: true }, { message: validationMessageFactory.isISO8601 })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  endDate!: string;
}

export { CreateExpenseCycleRequest };
