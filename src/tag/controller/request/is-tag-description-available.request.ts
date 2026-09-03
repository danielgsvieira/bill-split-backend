import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { validationMessageFactory } from 'src/utils/validation';

class IsTagDescriptionAvailableRequest {
  declare readonly __brand: symbol & { __brand: 'IsTagDescriptionAvailableRequest' };

  @ApiProperty()
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  description!: string;
}

export { IsTagDescriptionAvailableRequest };
