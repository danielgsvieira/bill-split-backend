import { AuthUser } from 'src/auth/auth-user';
import { BaseValidator } from 'src/core/BaseValidator';
import { CreateTagDto } from '../dto/create-tag.dto';
import { Injectable } from '@nestjs/common';
import { Tag } from '../../entity/tag.entity';
import { TagPolicy } from '../policy/tag.policy';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationErrorRule } from 'src/utils/validation';

type DTOs = CreateTagDto | UpdateTagDto;

@Injectable()
class TagValidator extends BaseValidator<Tag, DTOs, AuthUser> {
  constructor(
    private readonly policy: TagPolicy,
    private readonly userService: UserService,
  ) {
    super();
  }

  validateView(entity: Tag, user: AuthUser) {
    this.policy.canViewOrThrow(user, entity);
  }

  filterView(entities: Tag[]) {
    return entities;
  }

  validateCreate(dto: CreateTagDto, user: AuthUser) {
    this.policy.canCreateOrThrow(user);

    this.validOrThrow<CreateTagDto>({
      color: this.validateColor(dto),
    });
  }

  validateUpdate(dto: UpdateTagDto, entity: Tag, user: AuthUser) {
    this.policy.canUpdateOrThrow(user, entity);

    this.validOrThrow<UpdateTagDto>({
      color: this.validateColor(dto),
    });
  }

  validateDelete(entity: Tag, user: AuthUser) {
    this.policy.canDeleteOrThrow(user, entity);
  }

  private validateColor(dto: DTOs): ValidationErrorRule[] {
    const hexColorRegex = /^#[A-Fa-f0-9]{6}$/;

    if (hexColorRegex.test(dto.color)) {
      return [['isHexColorString']];
    }

    return [];
  }
}

export { TagValidator };
