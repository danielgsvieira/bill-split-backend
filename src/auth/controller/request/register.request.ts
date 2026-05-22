import { ApiProperty } from '@nestjs/swagger';
import { validationMessageFactory } from 'src/utils/validation';
import { IsNotEmpty, Length } from 'class-validator';

class RegisterRequest {
  declare readonly __brand: symbol & { __brand: 'RegisterRequest' };

  @ApiProperty()
  @Length(3, 32)
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @Length(4, 32)
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @Length(1, 255, { message: validationMessageFactory.length })
  @IsNotEmpty()
  displayName!: string;
}

export { RegisterRequest };
