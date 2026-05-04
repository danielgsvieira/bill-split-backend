class CreateUserDto {
  readonly username: string;

  readonly passwordHash: string;

  readonly displayName: string;

  constructor(data: {
    readonly username: string;
    readonly passwordHash: string;
    readonly displayName: string;
  }) {
    this.username = data.username;
    this.passwordHash = data.passwordHash;
    this.displayName = data.displayName;
  }
}

export { CreateUserDto };
