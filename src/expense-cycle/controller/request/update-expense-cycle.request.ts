import { Type } from 'class-transformer';
import { validationMessageFactory } from 'src/utils/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsISO8601, IsNotEmpty, IsOptional, Length } from 'class-validator';

class UpdateExpenseCycleRequest {
  @ApiProperty()
  @Length(1, 255, { message: validationMessageFactory.length })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 3000, { message: validationMessageFactory.length })
  description?: string;

  @ApiProperty({ type: [Number] })
  @IsInt({ each: true, message: validationMessageFactory.isInt })
  @IsArray({ message: validationMessageFactory.isArray })
  @IsNotEmpty({ each: true, message: validationMessageFactory.isNotEmpty })
  sharedWithIds!: number[];

  @ApiProperty()
  @IsISO8601({ strict: true }, { message: validationMessageFactory.isISO8601 })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  startDate!: string;

  @ApiProperty()
  @IsISO8601({ strict: true }, { message: validationMessageFactory.isISO8601 })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  endDate!: string;
}

export { UpdateExpenseCycleRequest };
