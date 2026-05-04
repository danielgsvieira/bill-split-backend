import { ApiProperty } from '@nestjs/swagger';

class IsUsernameAvailableResponse {
  @ApiProperty()
  readonly isAvailable: boolean;

  constructor(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }
}

export { IsUsernameAvailableResponse };
