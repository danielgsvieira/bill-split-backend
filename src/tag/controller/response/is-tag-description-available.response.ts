import { ApiProperty } from '@nestjs/swagger';

class IsTagDescriptionAvailableResponse {
  declare readonly __brand: symbol & { __brand: 'IsTagDescriptionAvailableResponse' };

  @ApiProperty()
  readonly isAvailable: boolean;

  constructor(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }
}

export { IsTagDescriptionAvailableResponse };
