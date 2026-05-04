import { ApiProperty } from '@nestjs/swagger';
import { AuthenticatedUserResponse } from './authenticated-user.response';
import { User } from 'src/user/entity/user.entity';

class AuthenticationResponse {
  @ApiProperty()
  readonly user: AuthenticatedUserResponse;

  @ApiProperty()
  readonly token: string;

  constructor(data: { user: AuthenticatedUserResponse; token: string }) {
    this.user = data.user;
    this.token = data.token;
  }

  static fromUserEntityAndToken(data: { user: User; token: string }) {
    return new AuthenticationResponse({
      user: AuthenticatedUserResponse.fromUserEntity(data.user),
      token: data.token,
    });
  }
}

export { AuthenticationResponse };
