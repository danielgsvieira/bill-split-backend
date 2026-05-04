import { AuthUser } from 'src/auth/auth-user';
import { BasePolicy } from 'src/core/BasePolicy';
import { ExpenseCycle } from '../../entity/expense-cycle.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class ExpenseCyclePolicy extends BasePolicy<AuthUser, ExpenseCycle> {
  canCreate() {
    return true;
  }

  canView(user: AuthUser, resource: ExpenseCycle) {
    if (resource.sharedWith === undefined) {
      throw resource.getRelationNotLoadedError('sharedWith');
    }

    const sharedWithIds = resource.sharedWith.map((el) => el.id);

    return resource.userId === user.id || sharedWithIds.includes(user.id);
  }

  canUpdate(user: AuthUser, resource: ExpenseCycle) {
    return resource.userId === user.id;
  }

  canDelete(user: AuthUser, resource: ExpenseCycle) {
    return resource.userId === user.id;
  }

  canUpdateShared(user: AuthUser, resource: ExpenseCycle) {
    if (resource.sharedWith === undefined) {
      throw resource.getRelationNotLoadedError('sharedWith');
    }

    const sharedWithIds = resource.sharedWith.map((el) => el.id);

    return sharedWithIds.includes(user.id);
  }

  canUpdateSharedOrThrow(user: AuthUser, resource: ExpenseCycle) {
    this.throwErrorIf(!this.canUpdateShared(user, resource));
  }
}

export { ExpenseCyclePolicy };
