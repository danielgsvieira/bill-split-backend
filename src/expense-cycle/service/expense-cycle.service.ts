import { AuthUser } from 'src/auth/auth-user';
import { CreateExpenseCycleDto } from './dto/create-expense-cycle.dto';
import { ExpenseCycle } from '../entity/expense-cycle.entity';
import { ExpenseCycleUserBudget } from '../entity/expense-cycle-user-budget.entity';
import { ExpenseCycleValidator } from './validation/expense-cycle.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateExpenseCycleDto } from './dto/update-expense-cycle.dto';
import { UpdateExpenseCycleUserBudgetsDto } from './dto/update-expense-cycle-user-bugdets.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationException } from 'src/utils/exceptions/validation-exception';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class ExpenseCycleService {
  private readonly defaultRelations: FindManyOptions<ExpenseCycle>['relations'] = {
    budgets: { user: true },
    createdBy: true,
    expenses: false,
    sharedWith: true,
  };

  constructor(
    @InjectRepository(ExpenseCycle)
    private readonly expenseCycleRepository: Repository<ExpenseCycle>,
    private readonly validator: ExpenseCycleValidator,
    private readonly userService: UserService,
    @InjectRepository(ExpenseCycleUserBudget)
    private readonly budgetRepository: Repository<ExpenseCycleUserBudget>,
  ) {}

  private async findOneOrThrowNotFound(options: FindOneOptions<ExpenseCycle>) {
    const expenseCycle = await this.expenseCycleRepository.findOne({
      relations: this.defaultRelations,
      ...options,
    });

    if (expenseCycle === null) {
      throw new NotFoundException();
    }

    return expenseCycle;
  }

  async create(dto: CreateExpenseCycleDto, user: AuthUser) {
    await this.validator.validateCreate(dto, user);

    const newExpenseCycle = this.expenseCycleRepository.create({ ...dto, userId: user.id });

    if (dto.sharedWithIds !== null && dto.sharedWithIds.length > 0) {
      const sharedWith = await this.userService.findById(dto.sharedWithIds);
      newExpenseCycle.sharedWith = sharedWith;
    }

    const saved = await this.expenseCycleRepository.save(newExpenseCycle);

    const created = await this.findOneById(saved.id, user);

    await this.afterCreate(created);

    return this.findOneById(saved.id, user);
  }

  private async afterCreate(expenseCycle: ExpenseCycle) {
    await this.addBudgetsForNewUsers(expenseCycle);
  }

  private async addBudgetsForNewUsers(expenseCycle: ExpenseCycle) {
    if (expenseCycle.budgets === undefined) {
      throw expenseCycle.getRelationNotLoadedError('budgets');
    }

    const budgetUserIds = expenseCycle.budgets.map((el) => el.userId);
    const usersWithoutBudget = expenseCycle.users.filter(
      (user) => !budgetUserIds.includes(user.id),
    );
    const newBudgets = usersWithoutBudget.map((user) => {
      const budget = new ExpenseCycleUserBudget();
      budget.expenseCycleId = expenseCycle.id;
      budget.userId = user.id;
      budget.valueInCents = 0;

      return budget;
    });
    await this.budgetRepository.save(newBudgets);
  }

  async findAll(user: AuthUser) {
    const list = await this.expenseCycleRepository.find({
      where: [{ userId: user.id }, { sharedWith: { id: user.id } }],
      relations: this.defaultRelations,
    });

    return this.validator.filterView(list, user);
  }

  async findOneById(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });
    this.validator.validateView(expenseCycle, user);

    return expenseCycle;
  }

  async update(id: number, dto: UpdateExpenseCycleDto, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });

    await this.validator.validateUpdate(dto, expenseCycle, user);

    expenseCycle.title = dto.title;
    expenseCycle.description = dto.description;
    expenseCycle.startDate = dto.startDate;
    expenseCycle.endDate = dto.endDate;

    const sharedWith = await this.userService.findById(dto.sharedWithIds);
    expenseCycle.sharedWith = sharedWith;

    await this.expenseCycleRepository.save(expenseCycle);

    const updated = await this.findOneById(id, user);

    await this.afterUpdate(updated);

    return this.findOneById(id, user);
  }

  private async afterUpdate(expenseCycle: ExpenseCycle) {
    await this.addBudgetsForNewUsers(expenseCycle);
    await this.removeBudgetsFromRemovedUsers(expenseCycle);
  }

  private async removeBudgetsFromRemovedUsers(expenseCycle: ExpenseCycle) {
    if (expenseCycle.budgets === undefined) {
      throw expenseCycle.getRelationNotLoadedError('budgets');
    }

    const budgetsToRemove = expenseCycle.budgets.filter(
      (budget) => !expenseCycle.userIds.includes(budget.userId),
    );
    await this.budgetRepository.remove(budgetsToRemove);
  }

  async remove(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });
    this.validator.validateDelete(expenseCycle, user);

    await this.expenseCycleRepository.remove(expenseCycle);

    return expenseCycle;
  }

  async listExpenseCycleUsers(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneById(id, user);

    return expenseCycle.users;
  }

  async updateUserBudgets(id: number, dto: UpdateExpenseCycleUserBudgetsDto, user: AuthUser) {
    const expenseCycle = await this.findOneById(id, user);

    this.validator.validateUpdateUserBudgets(dto, expenseCycle, user);

    if (expenseCycle.budgets === undefined) {
      throw expenseCycle.getRelationNotLoadedError('budgets');
    }

    const budgetsMap = expenseCycle.budgets.reduce(
      (acc, budget) => {
        acc[budget.id] = budget;
        return acc;
      },
      {} as Record<number, ExpenseCycleUserBudget>,
    );
    const budgetsToSave = dto.budgets.map((budgetDto) => {
      const budget = budgetsMap[budgetDto.id];

      if (budget === undefined) {
        throw new ValidationException({
          budgets: [
            [
              'domain',
              `ExpenseCycleUserBudget with id ${budgetDto.id} is not included in the ExpenseCycle`,
            ],
          ],
        });
      }

      budget.valueInCents = budgetDto.valueInCents;

      return budget;
    });

    await this.budgetRepository.save(budgetsToSave);

    await this.expenseCycleRepository.update(id, { updatedAt: new Date() });

    return this.findOneById(id, user);
  }
}

export { ExpenseCycleService };
