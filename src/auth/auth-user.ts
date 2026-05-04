import { User } from 'src/user/entity/user.entity';

class AuthUser {
  constructor(
    readonly id: number,
    readonly username: string,
    readonly displayName: string,
  ) {}

  static fromUser(user: User) {
    return new AuthUser(user.id, user.username, user.displayName);
  }
}

export { AuthUser };
