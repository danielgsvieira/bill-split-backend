class RegisterDto {
  declare readonly __brand: symbol & { __brand: 'RegisterDto' };

  readonly username: string;

  readonly password: string;

  readonly displayName: string;

  constructor(data: { username: string; password: string; displayName: string }) {
    this.username = data.username;
    this.password = data.password;
    this.displayName = data.displayName;
  }
}

export { RegisterDto };
