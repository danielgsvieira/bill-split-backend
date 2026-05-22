import { ApiProperty } from '@nestjs/swagger';

class IsUsernameAvailableResponse {
  declare readonly __brand: symbol & { __brand: 'IsUsernameAvailableResponse' };

  @ApiProperty()
  readonly isAvailable: boolean;

  constructor(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }
}

export { IsUsernameAvailableResponse };
