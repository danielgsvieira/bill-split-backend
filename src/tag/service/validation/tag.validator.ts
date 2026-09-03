import { AuthUser } from 'src/auth/auth-user';
import { BaseValidator } from 'src/core/BaseValidator';
import { CreateTagDto } from '../dto/create-tag.dto';
import { Injectable } from '@nestjs/common';
import { Tag } from '../../entity/tag.entity';
import { TagPolicy } from '../policy/tag.policy';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { ValidationErrorRule } from 'src/utils/validation';
import { DataSource, ILike } from 'typeorm';

type DTOs = CreateTagDto | UpdateTagDto;

@Injectable()
class TagValidator extends BaseValidator<Tag, DTOs, AuthUser> {
  constructor(
    private readonly policy: TagPolicy,
    protected readonly dataSource: DataSource,
  ) {
    super();
  }

  validateView(entity: Tag, user: AuthUser) {
    this.policy.canViewOrThrow(user, entity);
  }

  filterView(entities: Tag[]) {
    return entities;
  }

  async validateCreate(dto: CreateTagDto, user: AuthUser) {
    this.policy.canCreateOrThrow(user);

    this.validOrThrow<CreateTagDto>({
      description: await this.validateDescription(dto),
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

    if (!hexColorRegex.test(dto.color)) {
      return [['isHexColorString']];
    }

    return [];
  }

  private async validateDescription(dto: DTOs): Promise<ValidationErrorRule[]> {
    const count = await this.dataSource.manager.count(Tag, {
      where: { description: ILike(dto.description) },
    });

    if (count > 0) {
      return [['domain', 'tag with this description already exists']];
    }

    return [];
  }
}

export { TagValidator };
