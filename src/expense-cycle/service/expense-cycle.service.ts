import { AuthUser } from 'src/auth/auth-user';
import { CreateExpenseCycleDto } from './dto/create-expense-cycle.dto';
import { ExpenseCycle } from '../entity/expense-cycle.entity';
import { ExpenseCycleValidator } from './validation/expense-cycle.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateExpenseCycleDto } from './dto/update-expense-cycle.dto';
import { UpdateSharedExpenseCycleDto } from './dto/update-shared-expense-cycle.dto';
import { UserService } from 'src/user/service/user.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class ExpenseCycleService {
  private readonly defaultRelations: FindManyOptions<ExpenseCycle>['relations'] = {
    createdBy: true,
    sharedWith: true,
    expenses: false,
  };

  constructor(
    @InjectRepository(ExpenseCycle)
    private readonly repository: Repository<ExpenseCycle>,
    private readonly validator: ExpenseCycleValidator,
    private readonly userService: UserService,
  ) {}

  private async findOneOrThrowNotFound(options: FindOneOptions<ExpenseCycle>) {
    const expenseCycle = await this.repository.findOne({
      relations: this.defaultRelations,
      ...options,
    });

    if (expenseCycle === null) {
      throw new NotFoundException();
    }

    return expenseCycle;
  }

  async create(dto: CreateExpenseCycleDto, user: AuthUser) {
    await this.validator.validateCreate(dto, user);

    const newExpenseCycle = this.repository.create(dto);

    if (dto.sharedWithIds !== null && dto.sharedWithIds.length > 0) {
      const sharedWith = await this.userService.findById(dto.sharedWithIds);
      newExpenseCycle.sharedWith = sharedWith;
    }

    const saved = await this.repository.save(newExpenseCycle);

    return this.findOneById(saved.id, user);
  }

  async findAll(user: AuthUser) {
    const list = await this.repository.find({
      where: [{ userId: user.id }, { sharedWith: { id: user.id } }],
      relations: this.defaultRelations,
    });

    return this.validator.filterView(list, user);
  }

  async findOneById(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });
    this.validator.validateView(expenseCycle, user);

    return expenseCycle;
  }

  async update(id: number, dto: UpdateExpenseCycleDto, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });

    await this.validator.validateUpdate(dto, expenseCycle, user);

    expenseCycle.title = dto.title;
    expenseCycle.description = dto.description;
    expenseCycle.startDate = dto.startDate;
    expenseCycle.endDate = dto.endDate;

    const sharedWith = await this.userService.findById(dto.sharedWithIds);
    expenseCycle.sharedWith = sharedWith;

    await this.repository.save(expenseCycle);

    return this.findOneById(id, user);
  }

  async updateShared(id: number, dto: UpdateSharedExpenseCycleDto, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { sharedWith: true },
    });

    this.validator.validateUpdateShared(dto, expenseCycle, user);

    expenseCycle.title = dto.title;
    expenseCycle.description = dto.description;
    expenseCycle.startDate = dto.startDate;
    expenseCycle.endDate = dto.endDate;

    await this.repository.save(expenseCycle);

    return this.findOneById(id, user);
  }

  async remove(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });
    this.validator.validateDelete(expenseCycle, user);

    return this.repository.remove(expenseCycle);
  }
}

export { ExpenseCycleService };
