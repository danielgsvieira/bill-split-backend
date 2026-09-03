import { CreateUserDto } from 'src/user/service/dto/create-user.dto';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findOneByUsername(dto.username);

    if (user === null || !this.hashService.compare(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = await this.generateToken(user);

    return { user, token };
  }

  async register(dto: RegisterDto) {
    const hashedPassword = this.hashService.hash(dto.password);
    const newUser = await this.userService.create(
      new CreateUserDto({
        username: dto.username,
        displayName: dto.displayName,
        passwordHash: hashedPassword,
      }),
    );

    const token = await this.generateToken(newUser);

    return { user: newUser, token };
  }

  private generateToken(user: User) {
    const jwtPayload = { sub: user.id, username: user.username };
    return this.jwtService.signAsync(jwtPayload);
  }

  async isUsernameAvailable(username: string) {
    const exists = await this.userService.existByUsername(username);

    return !exists;
  }
}

export { AuthService };
