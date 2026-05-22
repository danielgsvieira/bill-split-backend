import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { validationMessageFactory } from 'src/utils/validation';

class IsUsernameAvailableRequest {
  declare readonly __brand: symbol & { __brand: 'IsUserNameAvailableRequest' };

  @ApiProperty()
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  username!: string;
}

export { IsUsernameAvailableRequest };
