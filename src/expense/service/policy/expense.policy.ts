import { AuthUser } from 'src/auth/auth-user';
import { BasePolicy } from 'src/core/BasePolicy';
import { Expense } from '../../entity/expense.entity';
import { ExpenseCycle } from 'src/expense-cycle/entity/expense-cycle.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class ExpensePolicy extends BasePolicy<AuthUser, Expense> {
  canCreate(user: AuthUser, expenseCycle: ExpenseCycle) {
    return this.isExpenseCycleOwnerOrSharedWith(user, expenseCycle);
  }

  canView(user: AuthUser, resource: Expense) {
    return this.isExpenseCycleOwnerOrSharedWith(user, resource);
  }

  canUpdate(user: AuthUser, resource: Expense) {
    return this.isExpenseCycleOwnerOrSharedWith(user, resource);
  }

  canDelete(user: AuthUser, resource: Expense) {
    return this.isExpenseCycleOwnerOrSharedWith(user, resource);
  }

  private isExpenseCycleOwnerOrSharedWith(user: AuthUser, resource: ExpenseCycle): boolean;
  private isExpenseCycleOwnerOrSharedWith(user: AuthUser, resource: Expense): boolean;
  private isExpenseCycleOwnerOrSharedWith(
    user: AuthUser,
    resource: ExpenseCycle | Expense,
  ): boolean {
    let expenseCycle: ExpenseCycle;

    if (resource instanceof ExpenseCycle) {
      expenseCycle = resource;
    } else {
      if (resource.expenseCycle === undefined) {
        throw resource.getRelationNotLoadedError('expenseCycle');
      }

      expenseCycle = resource.expenseCycle;
    }

    if (expenseCycle.sharedWith === undefined) {
      throw expenseCycle.getRelationNotLoadedError('sharedWith');
    }

    const sharedWithIds = expenseCycle.sharedWith.map((el) => el.id);

    return expenseCycle.userId === user.id || sharedWithIds.includes(user.id);
  }
}

export { ExpensePolicy };
