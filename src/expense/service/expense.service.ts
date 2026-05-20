import { AuthUser } from 'src/auth/auth-user';
import { BaseDataService } from 'src/core/BaseDataService';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../entity/expense.entity';
import { ExpenseValidator } from './validation/expense.validator';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UserService } from 'src/user/service/user.service';
import { DataSource, FindManyOptions, FindOneOptions } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class ExpenseService extends BaseDataService {
  private readonly defaultRelations: FindManyOptions<Expense>['relations'] = {
    expenseCycle: { sharedWith: true },
    paidBy: true,
    sharedBetween: true,
  };

  constructor(
    protected readonly dataSource: DataSource,
    private readonly validator: ExpenseValidator,
    private readonly userService: UserService,
  ) {
    super();
  }

  private async findOneOrThrowNotFound(options: FindOneOptions<Expense>) {
    const expense = await this.entityManager.findOne(Expense, {
      relations: this.defaultRelations,
      ...options,
    });

    if (expense === null) {
      throw new NotFoundException();
    }

    return expense;
  }

  async create(dto: CreateExpenseDto, user: AuthUser) {
    await this.validator.validateCreate(dto, user);

    const newExpense = new Expense(dto);

    const sharedBetween = await this.userService.findById(dto.sharedBetweenIds);
    newExpense.sharedBetween = sharedBetween;

    const saved = await this.entityManager.save(newExpense);

    return this.findOneById(saved.id, user);
  }

  async findOneById(id: number, user: AuthUser) {
    const expense = await this.findOneOrThrowNotFound({
      where: { id },
      relations: this.defaultRelations,
    });
    this.validator.validateView(expense, user);

    return expense;
  }

  private async find(options: FindManyOptions<Expense>, user: AuthUser) {
    const expenses = await this.entityManager.find(Expense, {
      relations: this.defaultRelations,
      ...options,
    });

    return this.validator.filterView(expenses, user);
  }

  async update(id: number, dto: UpdateExpenseDto, user: AuthUser) {
    const expense = await this.findOneOrThrowNotFound({ where: { id } });

    await this.validator.validateUpdate(dto, expense, user);

    expense.description = dto.description;
    expense.date = dto.date;
    expense.isProportional = dto.isProportional;
    expense.valueInCents = dto.valueInCents;
    expense.paidByUserId = dto.paidByUserId;

    expense.sharedBetween = await this.userService.findById(dto.sharedBetweenIds);

    await this.entityManager.save(expense);

    return this.findOneById(id, user);
  }

  async remove(id: number, user: AuthUser) {
    const expense = await this.findOneOrThrowNotFound({ where: { id } });
    this.validator.validateDelete(expense, user);

    await this.entityManager.remove(expense);

    return expense;
  }

  findByExpenseCycleId(expenseCycleId: number, user: AuthUser) {
    return this.find({ where: { expenseCycleId } }, user);
  }
}

export { ExpenseService };
