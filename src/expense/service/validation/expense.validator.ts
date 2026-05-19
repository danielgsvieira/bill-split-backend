import { AuthUser } from 'src/auth/auth-user';
import { BaseValidator } from 'src/core/BaseValidator';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { Expense } from '../../entity/expense.entity';
import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { ExpenseCycleService } from 'src/expense-cycle/service/expense-cycle.service';
import { ExpensePolicy } from '../policy/expense.policy';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationErrorRule } from 'src/utils/validation';
import { ValidationException } from 'src/utils/exceptions/validation-exception';
import { Injectable, NotFoundException } from '@nestjs/common';

type DTOs = CreateExpenseDto | UpdateExpenseDto;

@Injectable()
class ExpenseValidator extends BaseValidator<Expense, DTOs, AuthUser> {
  constructor(
    private readonly policy: ExpensePolicy,
    private readonly userService: UserService,
    private readonly expenseCycleService: ExpenseCycleService,
  ) {
    super();
  }

  validateView(entity: Expense, user: AuthUser) {
    return this.policy.canViewOrThrow(user, entity);
  }

  filterView(entities: Expense[], user: AuthUser) {
    return entities.filter((el) => this.policy.canView(user, el));
  }

  async validateCreate(dto: CreateExpenseDto, user: AuthUser) {
    const expenseCycle = await this.getExpenseCycleByIdOrThrow(dto.expenseCycleId, user);

    this.policy.canCreateOrThrow(user, expenseCycle);

    this.validOrThrow<CreateExpenseDto>({
      date: this.validateDate(dto, expenseCycle),
      paidByUserId: await this.validatePaidByUserId(dto, expenseCycle),
      sharedBetweenIds: await this.validateSharedBetweenIds(dto, expenseCycle),
    });
  }

  async validateUpdate(dto: UpdateExpenseDto, entity: Expense, user: AuthUser) {
    this.policy.canUpdateOrThrow(user, entity);

    const expenseCycle = await this.getExpenseCycleByIdOrThrow(entity.expenseCycleId, user);

    this.validOrThrow<UpdateExpenseDto>({
      date: this.validateDate(dto, expenseCycle),
      paidByUserId: await this.validatePaidByUserId(dto, expenseCycle),
      sharedBetweenIds: await this.validateSharedBetweenIds(dto, expenseCycle),
    });
  }

  validateDelete(entity: Expense, user: AuthUser) {
    this.policy.canDeleteOrThrow(user, entity);
  }

  private async getExpenseCycleByIdOrThrow(expenseCycleId: number, user: AuthUser) {
    try {
      const expenseCycle = await this.expenseCycleService.findOneById(expenseCycleId, user);

      return expenseCycle;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new ValidationException({
          expenseCycleId: [['invalidId', 'expense-cycle', expenseCycleId.toString()]],
        });
      }

      throw err;
    }
  }

  private validateDate(
    dto: CreateExpenseDto | UpdateExpenseDto,
    expenseCycle: ExpenseCycle,
  ): ValidationErrorRule[] {
    const errors: ValidationErrorRule[] = [];

    if (expenseCycle.startDate > dto.date) {
      errors.push(['minDate', expenseCycle.startDate.toISOString()]);
    }

    if (expenseCycle.endDate < dto.date) {
      errors.push(['maxDate', expenseCycle.endDate.toISOString()]);
    }

    return errors;
  }

  private async validatePaidByUserId(
    dto: CreateExpenseDto | UpdateExpenseDto,
    expenseCycle: ExpenseCycle,
  ): Promise<ValidationErrorRule[]> {
    const errors: ValidationErrorRule[] = [];

    const existsById = await this.userService.existsById(dto.paidByUserId);
    if (!existsById) {
      errors.push(['invalidId', 'user', dto.paidByUserId.toString()]);
    }

    if (expenseCycle.sharedWith === undefined) {
      throw expenseCycle.getRelationNotLoadedError('sharedWith');
    }

    if (!expenseCycle.userIds.includes(dto.paidByUserId)) {
      errors.push([
        'domain',
        `User with id ${dto.paidByUserId} is not included in the ExpenseCycle`,
      ]);
    }

    return errors;
  }

  private async validateSharedBetweenIds(
    dto: CreateExpenseDto | UpdateExpenseDto,
    expenseCycle: ExpenseCycle,
  ): Promise<ValidationErrorRule[]> {
    if (expenseCycle.sharedWith === undefined) {
      throw expenseCycle.getRelationNotLoadedError('sharedWith');
    }

    const errors: ValidationErrorRule[] = [];

    const existsByIdsMap = await this.userService.existsByIds(dto.sharedBetweenIds);
    const existsByIdsErrors: ValidationErrorRule[] = existsByIdsMap
      .filter(([, exists]) => !exists)
      .map(([userId]) => ['invalidId', 'user', userId.toString()]);
    errors.push(...existsByIdsErrors);

    const notIncludedInExpenseCycleErrors: ValidationErrorRule[] = dto.sharedBetweenIds
      .filter((userId) => !expenseCycle.userIds.includes(userId))
      .map((userId) => ['domain', `User id ${userId} not included in the ExpenseCycle`]);
    errors.push(...notIncludedInExpenseCycleErrors);

    return errors;
  }
}

export { ExpenseValidator };
