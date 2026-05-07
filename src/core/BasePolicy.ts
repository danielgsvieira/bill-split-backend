import { type BaseEntity } from './BaseEntity';
import { ForbiddenException } from '@nestjs/common';

abstract class BasePolicy<U, R extends BaseEntity<R, keyof R>> {
  abstract canCreate(user: U, additionalData?: unknown): boolean;

  abstract canView(user: U, resource: R): boolean;

  abstract canUpdate(user: U, resource: R): boolean;

  abstract canDelete(user: U, resource: R): boolean;

  protected throwErrorIf(condition: boolean) {
    if (condition) {
      throw new ForbiddenException();
    }
  }

  canCreateOrThrow(user: U, additionalData?: unknown) {
    this.throwErrorIf(!this.canCreate(user, additionalData));
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
