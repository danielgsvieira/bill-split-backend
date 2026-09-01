import { ApiProperty } from '@nestjs/swagger';
import { validationMessageFactory } from 'src/utils/validation';
import { IsNotEmpty, Length } from 'class-validator';

class CreateTagRequest {
  declare readonly __brand: symbol & { __brand: 'CreateTagRequest' };

  @ApiProperty()
  @Length(1, 255, { message: validationMessageFactory.length })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  description!: string;

  @ApiProperty()
  @Length(7, 7, { message: validationMessageFactory.length })
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  color!: string;
}

export { CreateTagRequest };
