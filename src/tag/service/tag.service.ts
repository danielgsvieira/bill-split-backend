import { AuthUser } from 'src/auth/auth-user';
import { BaseDataService } from 'src/core/BaseDataService';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from '../entity/tag.entity';
import { TagValidator } from './validation/tag.validator';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DataSource, FindOneOptions } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class TagService extends BaseDataService {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly validator: TagValidator,
  ) {
    super();
  }

  private async findOneOrThrowNotFound(options: FindOneOptions<Tag>) {
    const tag = await this.entityManager.findOne(Tag, options);

    if (tag === null) {
      throw new NotFoundException();
    }

    return tag;
  }

  async create(dto: CreateTagDto, user: AuthUser) {
    this.validator.validateCreate(dto, user);

    const newTag = new Tag({
      description: dto.description,
      color: dto.color,
      userId: user.id,
    });

    const saved = await this.entityManager.save(newTag);

    return this.findOneOrThrowNotFound({
      where: { id: saved.id },
      relations: { createdBy: true },
    });
  }

  async findOneById(id: number, user: AuthUser) {
    const tag = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { createdBy: true },
    });
    this.validator.validateView(tag, user);

    return tag;
  }

  async update(id: number, dto: UpdateTagDto, user: AuthUser) {
    const tag = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { createdBy: true },
    });

    this.validator.validateUpdate(dto, tag, user);

    tag.description = dto.description;
    tag.color = dto.color;

    await this.entityManager.save(tag);

    return this.findOneOrThrowNotFound({
      where: { id },
      relations: { createdBy: true },
    });
  }

  async remove(id: number, user: AuthUser) {
    const tag = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { createdBy: true },
    });
    this.validator.validateDelete(tag, user);

    await this.entityManager.remove(tag);

    return tag;
  }
}

export { TagService };
