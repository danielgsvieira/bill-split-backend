import { type BaseEntity } from './BaseEntity';
import { ForbiddenException } from '@nestjs/common';

abstract class BasePolicy<U, R extends BaseEntity> {
  abstract canCreate(user: U): boolean;

  abstract canView(user: U, resource: R): boolean;

  abstract canUpdate(user: U, resource: R): boolean;

  abstract canDelete(user: U, resource: R): boolean;

  protected throwErrorIf(condition: boolean) {
    if (condition) {
      throw new ForbiddenException();
    }
  }

  canCreateOrThrow(user: U) {
    this.throwErrorIf(!this.canCreate(user));
  }

  canViewOrThrow(user: U, resource: R) {
    this.throwErrorIf(!this.canView(user, resource));
  }

  canUpdateOrThrow(user: U, resource: R) {
    this.throwErrorIf(!this.canUpdate(user, resource));
  }

  canDeleteOrThrow(user: U, resource: R) {
    this.throwErrorIf(!this.canDelete(user, resource));
  }
}

export { BasePolicy };
