import { AuthUser } from 'src/auth/auth-user';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from '../entity/expense.entity';
import { ExpenseValidator } from './validation/expense.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UserService } from 'src/user/service/user.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class ExpenseService {
  private readonly defaultRelations: FindManyOptions<Expense>['relations'] = {
    expenseCycle: { sharedWith: true },
    paidBy: true,
    sharedBetween: true,
  };

  constructor(
    @InjectRepository(Expense)
    private readonly repository: Repository<Expense>,
    private readonly validator: ExpenseValidator,
    private readonly userService: UserService,
  ) {}

  private async findOneOrThrowNotFound(options: FindOneOptions<Expense>) {
    const expense = await this.repository.findOne({ relations: this.defaultRelations, ...options });

    if (expense === null) {
      throw new NotFoundException();
    }

    return expense;
  }

  async create(dto: CreateExpenseDto, user: AuthUser) {
    await this.validator.validateCreate(dto, user);

    const newExpense = this.repository.create(dto);

    const sharedBetween = await this.userService.findById(dto.sharedBetweenIds);
    newExpense.sharedBetween = sharedBetween;

    const saved = await this.repository.save(newExpense);

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
    const expenses = await this.repository.find({
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

    await this.repository.save(expense);

    return this.findOneById(id, user);
  }

  async remove(id: number, user: AuthUser) {
    const expense = await this.findOneOrThrowNotFound({ where: { id } });
    this.validator.validateDelete(expense, user);

    await this.repository.remove(expense);

    return expense;
  }

  findByExpenseCycleId(expenseCycleId: number, user: AuthUser) {
    return this.find({ where: { expenseCycleId } }, user);
  }
}

export { ExpenseService };
