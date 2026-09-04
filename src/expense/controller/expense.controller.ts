import { AuthUser } from 'src/auth/auth-user';
import { CreateExpenseDto } from '../service/dto/create-expense.dto';
import { CreateExpenseRequest } from './request/create-expense.request';
import { ExpenseResponse } from './response/expense.response';
import { ExpenseService } from '../service/expense.service';
import { RequestUser } from 'src/auth/decorator/auth-user.decotator';
import { UpdateExpenseDto } from '../service/dto/update-expense.dto';
import { UpdateExpenseRequest } from './request/update-expense.request';
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
  Post,
  Put,
  Query,
} from '@nestjs/common';

@ApiBearerAuth()
@Controller('expense')
class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: ExpenseResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@RequestUser() user: AuthUser, @Body() requestBody: CreateExpenseRequest) {
    const dto = new CreateExpenseDto(requestBody);

    const entity = await this.expenseService.create(dto, user);

    return ExpenseResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ExpenseResponse })
  @Get(':id')
  async findOne(@RequestUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    const entity = await this.expenseService.findOneById(id, user);

    return ExpenseResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ExpenseResponse })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @RequestUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateExpenseRequest,
  ) {
    const dto = new UpdateExpenseDto(requestBody);
    const entity = await this.expenseService.update(id, dto, user);

    return ExpenseResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ExpenseResponse })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@RequestUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    const entity = await this.expenseService.remove(id, user);

    return ExpenseResponse.fromEntity(entity);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [ExpenseResponse] })
  @HttpCode(HttpStatus.OK)
  @Get('find-by-expense-cycle-id/:expenseCycleId')
  async findByExpenseCycleId(
    @RequestUser() user: AuthUser,
    @Param('expenseCycleId', ParseIntPipe) expenseCylceId: number,
  ) {
    const entities = await this.expenseService.findByExpenseCycleId(expenseCylceId, user);

    return ExpenseResponse.fromEntity(entities);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [String] })
  @HttpCode(HttpStatus.OK)
  @Get('autocomplete/description')
  async descriptionAutocomplete(
    @RequestUser() user: AuthUser,
    @Query('description') decription: string,
  ) {
    const strings = await this.expenseService.getDescriptionAutocomplete(decription, user);

    return strings;
  }
}

export { ExpenseController };
