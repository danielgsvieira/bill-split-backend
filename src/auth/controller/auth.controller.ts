import { AuthenticatedUserResponse } from './response/authenticated-user.response';
import { AuthenticationResponse } from './response/authentication.response';
import { AuthService } from '../service/auth.service';
import { AuthUser } from '../auth-user';
import { BaseController } from 'src/core/BaseController';
import { IsUsernameAvailableRequest } from './request/is-username-available.request';
import { IsUsernameAvailableResponse } from './response/is-username-available.response';
import { LoginDto } from '../service/dto/login.dto';
import { LoginRequest } from './request/login.request';
import { PublicRoute } from '../decorator/public-route.decorator';
import { RegisterDto } from '../service/dto/register.dto';
import { RegisterRequest } from './request/register.request';
import { RequestUser } from '../decorator/auth-user.decotator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @ApiResponse({ status: HttpStatus.OK, type: AuthenticationResponse })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @PublicRoute()
  async login(@Body() requestBody: LoginRequest) {
    const result = await this.authService.login(new LoginDto(requestBody));

    return AuthenticationResponse.fromUserEntityAndToken(result);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: AuthenticationResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @PublicRoute()
  async register(@Body() requestBody: RegisterRequest) {
    const result = await this.authService.register(new RegisterDto(requestBody));

    return AuthenticationResponse.fromUserEntityAndToken(result);
  }

  @ApiResponse({ status: HttpStatus.OK, type: AuthenticatedUserResponse })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('user-info')
  userInfo(@RequestUser() user: AuthUser) {
    return AuthenticatedUserResponse.fromAuthUser(user);
  }

  @ApiResponse({ status: HttpStatus.OK, type: IsUsernameAvailableResponse })
  @HttpCode(HttpStatus.OK)
  @Post('is-username-available')
  @PublicRoute()
  async isUsernameAvailable(@Body() requestBody: IsUsernameAvailableRequest) {
    const isAvailable = await this.authService.isUsernameAvailable(requestBody.username);

    return new IsUsernameAvailableResponse(isAvailable);
  }
}

export { AuthController };
