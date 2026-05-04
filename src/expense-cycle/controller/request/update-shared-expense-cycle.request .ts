import { Type } from 'class-transformer';
import { validationMessageFactory } from 'src/utils/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsInt, IsNotEmpty, IsOptional, Length } from 'class-validator';

class UpdateSharedExpenseCycleRequest {
  @ApiProperty()
  @Length(1, 255, { message: validationMessageFactory.length })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 3000, { message: validationMessageFactory.length })
  description?: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray({ message: validationMessageFactory.isArray })
  @IsInt({ each: true, message: validationMessageFactory.isInt })
  sharedWithIds?: number[];

  @ApiProperty()
  @IsDate({ message: validationMessageFactory.isDate })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty()
  @IsDate({ message: validationMessageFactory.isDate })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  @Type(() => Date)
  endDate!: Date;
}

export { UpdateSharedExpenseCycleRequest };
