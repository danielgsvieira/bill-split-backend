import { AuthUser } from 'src/auth/auth-user';
import { BaseValidator } from 'src/core/BaseValidator';
import { CreateExpenseCycleDto } from '../dto/create-expense-cycle.dto';
import { ExpenseCycle } from '../../entity/expense-cycle.entity';
import { ExpenseCyclePolicy } from '../policy/expense-cycle.policy';
import { Injectable } from '@nestjs/common';
import { UpdateExpenseCycleDto } from '../dto/update-expense-cycle.dto';
import { UpdateSharedExpenseCycleDto } from '../dto/update-shared-expense-cycle.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationErrorRule } from 'src/utils/validation';

type DTOs = CreateExpenseCycleDto | UpdateExpenseCycleDto | UpdateSharedExpenseCycleDto;

@Injectable()
class ExpenseCycleValidator extends BaseValidator<ExpenseCycle, DTOs, AuthUser> {
  constructor(
    private readonly userService: UserService,
    private readonly policy: ExpenseCyclePolicy,
  ) {
    super();
  }

  validateView(entity: ExpenseCycle, user: AuthUser) {
    return this.policy.canViewOrThrow(user, entity);
  }

  filterView(entities: ExpenseCycle[], user: AuthUser) {
    return entities.filter((el) => this.policy.canView(user, el));
  }

  async validateCreate(dto: CreateExpenseCycleDto, user: AuthUser) {
    this.policy.canCreateOrThrow(user);

    this.validOrThrow<CreateExpenseCycleDto>({
      userId: await this.validateUserId(dto),
      startDate: this.validateDates(dto),
      sharedWithIds: await this.validateSharedWithIds(dto, user),
    });
  }

  async validateUpdate(dto: UpdateExpenseCycleDto, entity: ExpenseCycle, user: AuthUser) {
    this.policy.canUpdateOrThrow(user, entity);

    this.validOrThrow<UpdateExpenseCycleDto>({
      startDate: this.validateDates(dto),
      sharedWithIds: await this.validateSharedWithIds(dto, user),
    });
  }

  validateDelete(entity: ExpenseCycle, user: AuthUser) {
    this.policy.canDeleteOrThrow(user, entity);
  }

  validateUpdateShared(dto: UpdateSharedExpenseCycleDto, entity: ExpenseCycle, user: AuthUser) {
    this.policy.canUpdateSharedOrThrow(user, entity);

    this.validOrThrow<UpdateSharedExpenseCycleDto>({
      startDate: this.validateDates(dto),
    });
  }

  private async validateUserId(dto: CreateExpenseCycleDto): Promise<ValidationErrorRule[]> {
    const exists = await this.userService.existsById(dto.userId);

    return !exists ? [['invalidId', 'user', dto.userId.toString()]] : [];
  }

  private async validateSharedWithIds(
    dto: CreateExpenseCycleDto | UpdateExpenseCycleDto,
    user: AuthUser,
  ): Promise<ValidationErrorRule[]> {
    if (dto.sharedWithIds === null) {
      return dto instanceof CreateExpenseCycleDto ? [] : [['required']];
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

  private validateDates(
    dto: CreateExpenseCycleDto | UpdateExpenseCycleDto | UpdateSharedExpenseCycleDto,
  ): ValidationErrorRule[] {
    return dto.startDate >= dto.endDate
      ? [['domain', 'startDate needs to be smaller than endDate']]
      : [];
  }
}

export { ExpenseCycleValidator };
