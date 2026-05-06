import { AuthUser } from 'src/auth/auth-user';
import { BaseValidator } from 'src/core/BaseValidator';
import { CreateExpenseCycleDto } from '../dto/create-expense-cycle.dto';
import { ExpenseCycle } from '../../entity/expense-cycle.entity';
import { ExpenseCyclePolicy } from '../policy/expense-cycle.policy';
import { Injectable } from '@nestjs/common';
import { UpdateExpenseCycleDto } from '../dto/update-expense-cycle.dto';
import { UpdateSharedExpenseCycleDto } from '../dto/update-shared-expense-cycle.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationErrorRule, ValidationRuleFieldMap } from 'src/utils/validation';

@Injectable()
class ExpenseCycleValidator extends BaseValidator<
  ExpenseCycle,
  CreateExpenseCycleDto,
  UpdateExpenseCycleDto,
  AuthUser
> {
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

    const errors: ValidationRuleFieldMap<CreateExpenseCycleDto> = {
      userId: await this.validateUserId(dto),
      startDate: this.validateDates(dto),
    };

    if (dto.sharedWithIds !== null) {
      errors.sharedWithIds = await this.validateSharedWithIds(
        { sharedWithIds: dto.sharedWithIds },
        user,
      );
    }

    this.validOrThrow<CreateExpenseCycleDto>(errors);
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

  private async validateUserId(data: { userId: number }): Promise<ValidationErrorRule[]> {
    const exists = await this.userService.existsById(data.userId);

    return !exists ? [['invalidId', 'user', data.userId.toString()]] : [];
  }

  private async validateSharedWithIds(
    data: { sharedWithIds: number[] },
    user: AuthUser,
  ): Promise<ValidationErrorRule[]> {
    const errors: ValidationErrorRule[] = [];

    // User cannot share a expense cycle with themselves
    if (data.sharedWithIds.includes(user.id)) {
      errors.push(['domain', "sharedWithIds can not include the ExpenseCycle's owner id"]);
    }

    const existsByIdsMap = await this.userService.existsByIds(data.sharedWithIds);

    const existsByIdsErrors: ValidationErrorRule[] = existsByIdsMap
      .filter(([, exists]) => !exists)
      .map(([userId]) => {
        return ['invalidId', 'user', userId.toString()];
      });
    errors.push(...existsByIdsErrors);

    return errors;
  }

  private validateDates(data: { startDate: Date; endDate: Date }): ValidationErrorRule[] {
    return data.startDate >= data.endDate
      ? [['domain', 'startDate needs to be smaller than endDate']]
      : [];
  }
}

export { ExpenseCycleValidator };
