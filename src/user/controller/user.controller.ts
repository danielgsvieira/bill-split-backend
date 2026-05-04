import { AuthUser } from 'src/auth/auth-user';
import { BaseController } from 'src/core/BaseController';
import { RequestUser } from 'src/auth/decorator/auth-user.decotator';
import { UserResponse } from './response/user.response';
import { UserService } from '../service/user.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, HttpStatus } from '@nestjs/common';

@ApiBearerAuth()
@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @ApiResponse({ status: HttpStatus.OK, type: [UserResponse] })
  @Get('to-share-with')
  async usersToShareWith(@RequestUser() user: AuthUser) {
    const entities = await this.userService.findUsersAvailablerForSharing(user);

    return UserResponse.fromEntity(entities);
  }
}
