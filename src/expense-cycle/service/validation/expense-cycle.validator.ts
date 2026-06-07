import { AuthUser } from 'src/auth/auth-user';
import { BaseValidator } from 'src/core/BaseValidator';
import { CreateExpenseCycleDto } from '../dto/create-expense-cycle.dto';
import { ExpenseCycle } from '../../entity/expense-cycle.entity';
import { ExpenseCyclePolicy } from '../policy/expense-cycle.policy';
import { Injectable } from '@nestjs/common';
import { UpdateExpenseCycleDto } from '../dto/update-expense-cycle.dto';
import { UpdateExpenseCycleUserBudgetsDto } from '../dto/update-expense-cycle-user-bugdets.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationErrorRule } from 'src/utils/validation';

type DTOs = CreateExpenseCycleDto | UpdateExpenseCycleDto;

@Injectable()
class ExpenseCycleValidator extends BaseValidator<ExpenseCycle, DTOs, AuthUser> {
  constructor(
    private readonly userService: UserService,
    private readonly policy: ExpenseCyclePolicy,
  ) {
    super();
  }

  validateView(entity: ExpenseCycle, user: AuthUser) {
    this.policy.canViewOrThrow(user, entity);
  }

  filterView(entities: ExpenseCycle[], user: AuthUser) {
    return entities.filter((el) => this.policy.canView(user, el));
  }

  async validateCreate(dto: CreateExpenseCycleDto, user: AuthUser) {
    this.policy.canCreateOrThrow(user);

    this.validOrThrow<CreateExpenseCycleDto>({
      startDate: this.validateDates(dto),
      sharedWithIds: await this.validateSharedWithIds(dto, user),
    });
  }

  async validateUpdate(dto: UpdateExpenseCycleDto, entity: ExpenseCycle, user: AuthUser) {
    this.policy.canUpdateOrThrow(user, entity);

    this.validOrThrow<UpdateExpenseCycleDto>({
      startDate: this.validateDatesUpdate(dto, entity),
      sharedWithIds: await this.validateSharedWithIdsUpdate(dto, entity, user),
    });
  }

  validateDelete(entity: ExpenseCycle, user: AuthUser) {
    this.policy.canDeleteOrThrow(user, entity);
  }

  private async validateSharedWithIds(
    dto: CreateExpenseCycleDto | UpdateExpenseCycleDto,
    user: AuthUser,
  ): Promise<ValidationErrorRule[]> {
    if (dto.sharedWithIds === null) {
      return dto instanceof CreateExpenseCycleDto ? [] : [['isNotEmpty']];
    }

    const errors: ValidationErrorRule[] = [];

    // User cannot share a expense cycle with themselves
    if (dto.sharedWithIds.includes(user.id)) {
      errors.push(['domain', "sharedWithIds can not include the ExpenseCycle's owner id"]);
    }

    const existsByIdsMap = await this.userService.existsByIds(dto.sharedWithIds);

    const existsByIdsErrors: ValidationErrorRule[] = existsByIdsMap
      .filter(([, exists]) => !exists)
      .map(([userId]) => {
        return ['invalidId', 'user', userId.toString()];
      });
    errors.push(...existsByIdsErrors);

    return errors;
  }

  private async validateSharedWithIdsUpdate(
    dto: UpdateExpenseCycleDto,
    expenseCycle: ExpenseCycle,
    user: AuthUser,
  ): Promise<ValidationErrorRule[]> {
    if (expenseCycle.expenses === undefined) {
      throw expenseCycle.getRelationNotLoadedError('expenses');
    }

    const errors: ValidationErrorRule[] = await this.validateSharedWithIds(dto, user);

    const allExpensesUserIds = expenseCycle.expenses.reduce<Set<number>>((acc, expense) => {
      expense.userIds.forEach((id) => acc.add(id));
      return acc;
    }, new Set());

    const idsNotIncludedInSharedWith = Array.from(allExpensesUserIds).filter(
      (el) => el !== expenseCycle.userId && !dto.sharedWithIds.includes(el),
    );

    idsNotIncludedInSharedWith.forEach((id) => {
      errors.push([
        'domain',
        `User with ${id.toString()} is included in one or more Expenses from this Expense Cycle`,
      ]);
    });

    return errors;
  }

  private validateDates(dto: CreateExpenseCycleDto | UpdateExpenseCycleDto): ValidationErrorRule[] {
    return dto.startDate >= dto.endDate
      ? [['domain', 'startDate needs to be smaller than endDate']]
      : [];
  }

  private validateDatesUpdate(
    dto: UpdateExpenseCycleDto,
    expenseCycle: ExpenseCycle,
  ): ValidationErrorRule[] {
    if (expenseCycle.expenses === undefined) {
      throw expenseCycle.getRelationNotLoadedError('expenses');
    }

    const errors: ValidationErrorRule[] = this.validateDates(dto);

    if (expenseCycle.expenses.length > 0) {
      const sortedExpenses = expenseCycle.expenses.toSorted(
        (a, b) => a.date.getTime() - b.date.getTime(),
      );

      const earliestExpense = sortedExpenses[0] ?? null;
      if (earliestExpense !== null && earliestExpense.date < dto.startDate) {
        errors.push(['domain', 'startDate needs to be before the earliest expense']);
      }

      const latestExpense = sortedExpenses[sortedExpenses.length - 1] ?? null;
      if (latestExpense !== null && latestExpense.date > dto.endDate) {
        errors.push(['domain', 'endDate needs to be after the latest expense']);
      }
    }

    return errors;
  }

  validateUpdateUserBudgets(
    dto: UpdateExpenseCycleUserBudgetsDto,
    entity: ExpenseCycle,
    user: AuthUser,
  ) {
    this.policy.canUpdateOrThrow(user, entity);

    this.validOrThrow<UpdateExpenseCycleUserBudgetsDto>({
      budgets: this.validateBudgets(dto, entity),
    });
  }

  private validateBudgets(
    dto: UpdateExpenseCycleUserBudgetsDto,
    expenseCycle: ExpenseCycle,
  ): ValidationErrorRule[] {
    const errors: ValidationErrorRule[] = [];

    const dtoBudgetIds = dto.budgets.map((el) => el.id);

    if (new Set(dtoBudgetIds).size !== dtoBudgetIds.length) {
      errors.push(['domain', 'Duplicated ExpenseCycleUserBudget id']);
    }

    dto.budgets.forEach((budgetDto) => {
      if (!expenseCycle.budgetIds.includes(budgetDto.id)) {
        errors.push([
          'domain',
          `ExpenseCycleUserBudget with id ${budgetDto.id.toString()} is not included in the ExpenseCycle`,
        ]);
      }
    });

    if (expenseCycle.budgets === undefined) {
      throw expenseCycle.getRelationNotLoadedError('budgets');
    }

    const budgetIdsMissingFromDto = expenseCycle.budgetIds.filter(
      (budgetId) => !dtoBudgetIds.includes(budgetId),
    );

    if (budgetIdsMissingFromDto.length > 0) {
      errors.push(['domain', 'All Users in the ExpenseCycle must have a ExpenseCycleUserBudget']);
    }

    return errors;
  }
}

export { ExpenseCycleValidator };
