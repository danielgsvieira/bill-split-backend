import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { validationMessageFactory } from 'src/utils/validation';

class IsUsernameAvailableRequest {
  @ApiProperty()
  @IsNotEmpty({ message: validationMessageFactory.isNotEmpty })
  username!: string;
}

export { IsUsernameAvailableRequest };
