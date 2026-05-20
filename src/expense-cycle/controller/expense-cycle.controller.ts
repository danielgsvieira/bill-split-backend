import { AuthUser } from 'src/auth/auth-user';
import { BaseController } from 'src/core/BaseController';
import { CreateExpenseCycleDto } from '../service/dto/create-expense-cycle.dto';
import { CreateExpenseCycleRequest } from './request/create-expense-cycle.request';
import { ExpenseCycleResponse } from './response/expense-cycle.response';
import { ExpenseCycleService } from '../service/expense-cycle.service';
import { ExpenseCycleUserResponse } from './response/expense-cycle-user.response';
import { RequestUser } from 'src/auth/decorator/auth-user.decotator';
import { UpdateExpenseCycleDto } from '../service/dto/update-expense-cycle.dto';
import { UpdateExpenseCycleRequest } from './request/update-expense-cycle.request';
import { UpdateExpenseCycleUserBudgetsDto } from '../service/dto/update-expense-cycle-user-bugdets.dto';
import { UpdateExpenseCycleUserBudgetsRequest } from './request/update-expense-cycle-user-budgets.request';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@ApiBearerAuth()
@Controller('expense-cycle')
class ExpenseCycleController extends BaseController {
  constructor(private readonly expenseCycleService: ExpenseCycleService) {
    super();
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: ExpenseCycleResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @RequestUser() user: AuthUser,
    @Body() requestBody: CreateExpenseCycleRequest,
  ): Promise<ExpenseCycleResponse> {
    const dto = new CreateExpenseCycleDto(requestBody);

    const entity = await this.expenseCycleService.create(dto, user);

    return ExpenseCycleResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [ExpenseCycleResponse] })
  @Get()
  async findAll(@RequestUser() user: AuthUser) {
    const entities = await this.expenseCycleService.findAll(user);

    return ExpenseCycleResponse.fromEntity(entities);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ExpenseCycleResponse })
  @Get(':id')
  async findOne(@RequestUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    const entity = await this.expenseCycleService.findOneById(id, user);

    return ExpenseCycleResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ExpenseCycleResponse })
  @Put(':id')
  async update(
    @RequestUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateExpenseCycleRequest,
  ) {
    const dto = new UpdateExpenseCycleDto(requestBody);
    const entity = await this.expenseCycleService.update(id, dto, user);

    return ExpenseCycleResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ExpenseCycleResponse })
  @Delete(':id')
  async remove(@RequestUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    const entity = await this.expenseCycleService.remove(id, user);

    return ExpenseCycleResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [ExpenseCycleUserResponse] })
  @Get(':id/list-user')
  async listExpenseCycleUsers(
    @RequestUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const entities = await this.expenseCycleService.listExpenseCycleUsers(id, user);

    return ExpenseCycleUserResponse.fromEntity(entities);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ExpenseCycleResponse })
  @Patch(':id/update-user-budgets')
  async updateExpenseCycleUserBudgets(
    @RequestUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateExpenseCycleUserBudgetsRequest,
  ) {
    const dto = new UpdateExpenseCycleUserBudgetsDto(requestBody);
    const entity = await this.expenseCycleService.updateUserBudgets(id, dto, user);

    return ExpenseCycleResponse.fromEntity(entity);
  }
}

export { ExpenseCycleController };
