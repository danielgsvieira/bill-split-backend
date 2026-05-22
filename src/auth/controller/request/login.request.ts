import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { validationMessageFactory } from 'src/utils/validation';

class LoginRequest {
  declare readonly __brand: symbol & { __brand: 'LoginRequest' };

  @ApiProperty()
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  username!: string;

  @ApiProperty()
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  password!: string;
}

export { LoginRequest };
