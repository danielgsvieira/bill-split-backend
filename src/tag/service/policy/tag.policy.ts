import { AuthUser } from 'src/auth/auth-user';
import { BasePolicy } from 'src/core/BasePolicy';
import { Injectable } from '@nestjs/common';
import { Tag } from '../../entity/tag.entity';

@Injectable()
class TagPolicy extends BasePolicy<AuthUser, Tag> {
  canCreate() {
    return true;
  }

  canView() {
    return true;
  }

  canUpdate(user: AuthUser, resource: Tag) {
    return this.isTagCreator(user, resource);
  }

  canDelete(user: AuthUser, resource: Tag) {
    return this.isTagCreator(user, resource);
  }

  private isTagCreator(user: AuthUser, resource: Tag): boolean {
    if (resource.createdBy === undefined) {
      throw resource.getRelationNotLoadedError('createdBy');
    }

    return user.id === resource.createdBy.id;
  }
}

export { TagPolicy };
