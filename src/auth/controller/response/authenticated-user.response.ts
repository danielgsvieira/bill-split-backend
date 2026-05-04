import { AuthUser } from '../../auth-user';
import { User } from 'src/user/entity/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AuthenticatedUserResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly username: string;

  @ApiPropertyOptional()
  readonly displayName: string;

  constructor(data: { id: number; username: string; displayName: string }) {
    this.id = data.id;
    this.username = data.username;
    this.displayName = data.displayName;
  }

  static fromAuthUser(user: AuthUser) {
    return new AuthenticatedUserResponse(user);
  }

  static fromUserEntity(entity: User) {
    return new AuthenticatedUserResponse(entity);
  }
}

export { AuthenticatedUserResponse };
