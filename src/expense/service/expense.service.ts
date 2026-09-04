import { AuthUser } from 'src/auth/auth-user';
import { BaseDataService } from 'src/core/BaseDataService';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../entity/expense.entity';
import { ExpenseCycleService } from 'src/expense-cycle/service/expense-cycle.service';
import { ExpenseValidator } from './validation/expense.validator';
import { TagService } from 'src/tag/service/tag.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UserService } from 'src/user/service/user.service';
import { DataSource, FindOneOptions } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class ExpenseService extends BaseDataService {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly validator: ExpenseValidator,
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly expenseCycleService: ExpenseCycleService,
  ) {
    super();
  }

  private async findOneOrThrowNotFound(options: FindOneOptions<Expense>) {
    const expense = await this.entityManager.findOne(Expense, options);

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

    if (dto.tagIds.length > 0) {
      newExpense.tags = await this.tagService.findById(dto.tagIds);
    }

    const saved = await this.entityManager.save(newExpense);

    return this.findOneOrThrowNotFound({
      where: { id: saved.id },
      relations: { expenseCycle: true, paidBy: true, sharedBetween: true, tags: true },
    });
  }

  async findOneById(id: number, user: AuthUser) {
    const expense = await this.findOneOrThrowNotFound({
      where: { id },
      relations: {
        expenseCycle: { sharedWith: true, createdBy: true },
        paidBy: true,
        sharedBetween: true,
        tags: true,
      },
    });
    this.validator.validateView(expense, user);

    return expense;
  }

  async update(id: number, dto: UpdateExpenseDto, user: AuthUser) {
    const expense = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { expenseCycle: { createdBy: true, sharedWith: true } },
    });

    await this.validator.validateUpdate(dto, expense, user);

    expense.description = dto.description;
    expense.date = dto.date;
    expense.isProportional = dto.isProportional;
    expense.valueInCents = dto.valueInCents;
    expense.paidByUserId = dto.paidByUserId;

    expense.sharedBetween = await this.userService.findById(dto.sharedBetweenIds);
    expense.tags = await this.tagService.findById(dto.tagIds);

    await this.entityManager.save(expense);

    return this.findOneOrThrowNotFound({
      where: { id },
      relations: { expenseCycle: true, paidBy: true, sharedBetween: true, tags: true },
    });
  }

  async remove(id: number, user: AuthUser) {
    const expense = await this.findOneOrThrowNotFound({
      where: { id },
      relations: {
        expenseCycle: { createdBy: true, sharedWith: true },
        paidBy: true,
        sharedBetween: true,
        tags: true,
      },
    });
    this.validator.validateDelete(expense, user);

    await this.entityManager.remove(expense);

    return expense;
  }

  async findByExpenseCycleId(expenseCycleId: number, user: AuthUser) {
    const expenses = await this.entityManager.find(Expense, {
      where: { expenseCycleId },
      relations: {
        expenseCycle: { createdBy: true, sharedWith: true },
        paidBy: true,
        sharedBetween: true,
        tags: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return this.validator.filterView(expenses, user);
  }

  async getAllExpenseIdsByUser(user: AuthUser) {
    const expenseCycleIds = await this.expenseCycleService.getAllExpenseCycleIdsByUser(user);

    const results = await this.entityManager
      .createQueryBuilder(Expense, 'expense')
      .select('expense.id', 'id')
      .where('expense.expenseCycleId IN (:...expenseCycleIds)', { expenseCycleIds })
      .getRawMany<{ id: number }>();

    return results.map((el) => el.id);
  }

  async getDescriptionAutocomplete(description: string, user: AuthUser) {
    const expenseIds = await this.getAllExpenseIdsByUser(user);

    const results = await this.entityManager
      .createQueryBuilder(Expense, 'expense')
      .select('expense.description', 'description')
      .where('expense.id IN (:...expenseIds)', { expenseIds })
      .andWhere('expense.description ILIKE :description', { description: `%${description}%` })
      .distinct(true)
      .orderBy('expense.description', 'ASC')
      .getRawMany<{ description: string }>();

    return results.map((row) => row.description);
  }
}

export { ExpenseService };
