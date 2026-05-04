import { AuthUser } from 'src/auth/auth-user';
import { CreateExpenseCycleDto } from './dto/create-expense-cycle.dto';
import { ExpenseCycle } from '../entity/expense-cycle.entity';
import { ExpenseCyclePolicy } from './policy/expense-cycle.policy';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateExpenseCycleDto } from './dto/update-expense-cycle.dto';
import { UpdateSharedExpenseCycleDto } from './dto/update-shared-expense-cycle.dto';
import { UserService } from 'src/user/service/user.service';
import { ValidationException } from 'src/utils/exceptions/validation-exception';
import { FindOneOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
class ExpenseCycleService {
  constructor(
    @InjectRepository(ExpenseCycle)
    private readonly expenseCycleRepository: Repository<ExpenseCycle>,
    private readonly userService: UserService,
    private readonly expenseCyclePolicy: ExpenseCyclePolicy,
  ) {}

  private async findOneOrThrowNotFound(options: FindOneOptions<ExpenseCycle>) {
    const expenseCycle = await this.expenseCycleRepository.findOne(options);

    if (expenseCycle === null) {
      throw new NotFoundException();
    }

    return expenseCycle;
  }

  async create(dto: CreateExpenseCycleDto, user: AuthUser) {
    this.expenseCyclePolicy.canCreateOrThrow(user);
    this.validateDates(dto);

    const newExpenseCycle = this.expenseCycleRepository.create(dto);

    if (dto.sharedWithIds !== null && dto.sharedWithIds.length > 0) {
      await this.validateSharedWithIds(user, dto.sharedWithIds);
      const sharedWith = await this.userService.findById(dto.sharedWithIds);
      newExpenseCycle.sharedWith = sharedWith;
    }

    const saved = await this.expenseCycleRepository.save(newExpenseCycle);

    return this.findOneById(saved.id, user);
  }

  async findAll(user: AuthUser) {
    const list = await this.expenseCycleRepository.find({
      where: [{ userId: user.id }, { sharedWith: { id: user.id } }],
      relations: { sharedWith: true, createdBy: true },
    });

    return list.filter((el) => this.expenseCyclePolicy.canView(user, el));
  }

  async findOneById(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { createdBy: true, sharedWith: true },
    });
    this.expenseCyclePolicy.canViewOrThrow(user, expenseCycle);

    return expenseCycle;
  }

  async update(id: number, dto: UpdateExpenseCycleDto, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({ where: { id } });
    this.expenseCyclePolicy.canUpdateOrThrow(user, expenseCycle);
    this.validateDates(dto);

    expenseCycle.title = dto.title;
    expenseCycle.description = dto.description;
    expenseCycle.startDate = dto.startDate;
    expenseCycle.endDate = dto.endDate;

    await this.validateSharedWithIds(user, dto.sharedWithIds);
    const sharedWith = await this.userService.findById(dto.sharedWithIds);
    expenseCycle.sharedWith = sharedWith;

    await this.expenseCycleRepository.save(expenseCycle);

    return this.findOneById(id, user);
  }

  async updateShared(id: number, dto: UpdateSharedExpenseCycleDto, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { sharedWith: true },
    });
    this.expenseCyclePolicy.canUpdateSharedOrThrow(user, expenseCycle);
    this.validateDates(dto);

    expenseCycle.title = dto.title;
    expenseCycle.description = dto.description;
    expenseCycle.startDate = dto.startDate;
    expenseCycle.endDate = dto.endDate;

    await this.expenseCycleRepository.save(expenseCycle);

    return this.findOneById(id, user);
  }

  async remove(id: number, user: AuthUser) {
    const expenseCycle = await this.findOneOrThrowNotFound({
      where: { id },
      relations: { sharedWith: true, createdBy: true },
    });
    this.expenseCyclePolicy.canDeleteOrThrow(user, expenseCycle);

    return this.expenseCycleRepository.remove(expenseCycle);
  }

  // NOTE: optimize this method to use less db queries
  private async validateSharedWithIds(user: AuthUser, userIds: number[]) {
    // User cannot share a expense cycle with themselves
    if (userIds.includes(user.id)) {
      throw new ValidationException({ sharedWithIds: [['invalidId', 'user', user.id.toString()]] });
    }

    for (const userId of userIds) {
      const exists = await this.userService.existsById(userId);

      if (!exists) {
        throw new ValidationException({
          sharedWithIds: [['invalidId', 'user', userId.toString()]],
        });
      }
    }
  }

  private validateDates(data: { startDate: Date; endDate: Date }) {
    if (data.startDate >= data.endDate) {
      throw new ValidationException({ startDate: [['maxDate', data.endDate.toISOString()]] });
    }
  }
}

export { ExpenseCycleService };
