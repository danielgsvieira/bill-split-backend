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
    return resource.userIds.includes(user.id);
  }

  canUpdate(user: AuthUser, resource: ExpenseCycle) {
    return resource.userIds.includes(user.id);
  }

  canDelete(user: AuthUser, resource: ExpenseCycle) {
    return resource.userId === user.id;
  }
}

export { ExpenseCyclePolicy };
