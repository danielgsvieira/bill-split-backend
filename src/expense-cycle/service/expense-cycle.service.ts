import { AuthUser } from 'src/auth/auth-user';
import { BaseDataService } from 'src/core/BaseDataService';
import { CreateExpenseCycleDto } from './dto/create-expense-cycle.dto';
import { ExpenseCycle } from '../entity/expense-cycle.entity';
import { ExpenseCycleUserBudget } from '../entity/expense-cycle-user-budget.entity';
import { ExpenseCycleValidator } from './validation/expense-cycle.validator';
import { UpdateExpenseCycleDto } from './dto/update-expense-cycle.dto';
import { UpdateExpenseCycleUserBudgetsDto } from './dto/update-expense-cycle-user-bugdets.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationException } from 'src/utils/exceptions/validation-exception';
import { DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class ExpenseCycleService extends BaseDataService {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly validator: ExpenseCycleValidator,
    private readonly userService: UserService,
  ) {
    super();
  }

  private async findOneOrThrowNotFound(options: FindOneOptions<ExpenseCycle>) {
    const expenseCycle = await this.entityManager.findOne(ExpenseCycle, options);

    if (expenseCycle === null) {
      throw new NotFoundException();
    }

    return expenseCycle;
  }

  async create(dto: CreateExpenseCycleDto, user: AuthUser) {
    await this.validator.validateCreate(dto, user);

    const newExpenseCycle = new ExpenseCycle({ ...dto, userId: user.id });

    if (dto.sharedWithIds !== null && dto.sharedWithIds.length > 0) {
      const sharedWith = await this.userService.findById(dto.sharedWithIds);
      newExpenseCycle.sharedWith = sharedWith;
    }

    const savedId = await this.dataSource.transaction(async (transactionalEntityManager) => {
      const saved = await transactionalEntityManager.save(newExpenseCycle);

      const created = await transactionalEntityManager.findOne(ExpenseCycle, {
        where: { id: saved.id },
        relations: { budgets: true, createdBy: true, sharedWith: true },
      });

      if (created === null) {
        throw new Error('Error while loading ExpenseCycle');
      }

      await this.afterCreate(created, transactionalEntityManager);

      return saved.id;
    });

    return this.findOneOrThrowNotFound({ where: { id: savedId } });
  }

  private async afterCreate(expenseCycle: ExpenseCycle, transactionalEntityManager: EntityManager) {
    await this.addBudgetsForNewUsers(expenseCycle, transactionalEntityManager);
  }

  private async addBudgetsForNewUsers(
    expenseCycle: ExpenseCycle,
    transactionalEntityManager: EntityManager,
  ) {
    if (expenseCycle.budgets === undefined) {
      throw expenseCycle.getRelationNotLoadedError('budgets');
    }

    const budgetUserIds = expenseCycle.budgets.map((el) => el.userId);
    const usersWithoutBudget = expenseCycle.users.filter(
      (user) => !budgetUserIds.includes(user.id),
    );
    const newBudgets = usersWithoutBudget.map((user) => {
      return new ExpenseCycleUserBudget({
        expenseCycleId: expenseCycle.id,
        userId: user.id,
        valueInCents: 0,
      });
    });
    if (newBudgets.length > 0) {
      await transactionalEntityManager.save(newBudgets);
    }
  }

  async findAll(user: AuthUser) {
    const list = await this.entityManager.find(ExpenseCycle, {
      where: [{ userId: user.id }, { sharedWith: { id: user.id } }],
      relations: { createdBy: true, sharedWith: true },
    });

    return this.validator.filterView(list, user);
  }

  async findOneById(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({
      where: { id },
      relations: {
        budgets: { user: true },
        createdBy: true,
        expenses: { paidBy: true, sharedBetween: true },
        sharedWith: true,
      },
    });
    this.validator.validateView(expenseCycle, user);

    return expenseCycle;
  }

  async update(id: number, dto: UpdateExpenseCycleDto, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { createdBy: true, sharedWith: true },
    });

    await this.validator.validateUpdate(dto, expenseCycle, user);

    expenseCycle.title = dto.title;
    expenseCycle.description = dto.description;
    expenseCycle.startDate = dto.startDate;
    expenseCycle.endDate = dto.endDate;

    const sharedWith = await this.userService.findById(dto.sharedWithIds);
    expenseCycle.sharedWith = sharedWith;

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(expenseCycle);

      const updated = await transactionalEntityManager.findOne(ExpenseCycle, {
        where: { id },
        relations: { budgets: true, createdBy: true, sharedWith: true },
      });

      if (updated === null) {
        throw new Error('Error while loading ExpenseCycle');
      }

      await this.afterUpdate(updated, transactionalEntityManager);
    });

    return this.findOneOrThrowNotFound({ where: { id } });
  }

  private async afterUpdate(expenseCycle: ExpenseCycle, transactionalEntityManager: EntityManager) {
    await this.addBudgetsForNewUsers(expenseCycle, transactionalEntityManager);
    await this.removeBudgetsFromRemovedUsers(expenseCycle, transactionalEntityManager);
  }

  private async removeBudgetsFromRemovedUsers(
    expenseCycle: ExpenseCycle,
    transactionalEntityManager: EntityManager,
  ) {
    if (expenseCycle.budgets === undefined) {
      throw expenseCycle.getRelationNotLoadedError('budgets');
    }

    const budgetsToRemove = expenseCycle.budgets.filter(
      (budget) => !expenseCycle.userIds.includes(budget.userId),
    );

    if (budgetsToRemove.length > 0) {
      await transactionalEntityManager.remove(budgetsToRemove);
    }
  }

  async remove(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });
    this.validator.validateDelete(expenseCycle, user);

    await this.entityManager.remove(expenseCycle);

    return expenseCycle;
  }

  async listExpenseCycleUsers(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { createdBy: true, sharedWith: true },
    });
    this.validator.validateView(expenseCycle, user);

    return expenseCycle.users;
  }

  async updateUserBudgets(id: number, dto: UpdateExpenseCycleUserBudgetsDto, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });
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

    if (budgetsToSave.length > 0) {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(budgetsToSave);
        await transactionalEntityManager.update(ExpenseCycle, id, { updatedAt: new Date() });
      });
    }

    return this.findOneOrThrowNotFound({ where: { id } });
  }
}

export { ExpenseCycleService };
