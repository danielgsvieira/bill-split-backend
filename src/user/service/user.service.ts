import { AuthUser } from 'src/auth/auth-user';
import { BaseDataService } from 'src/core/BaseDataService';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { ValidationException } from 'src/utils/exceptions/validation-exception';
import { DataSource, In, Not } from 'typeorm';

@Injectable()
class UserService extends BaseDataService {
  constructor(protected readonly dataSource: DataSource) {
    super();
  }

  async create(dto: CreateUserDto) {
    const usernameAlreadyExists = await this.entityManager.existsBy(User, {
      username: dto.username,
    });

    if (usernameAlreadyExists) {
      throw new ValidationException({ username: [['domain', 'username already exists']] });
    }

    const entity = new User(dto);

    return this.entityManager.save(entity);
  }

  findOneById(id: number) {
    return this.entityManager.findOneBy(User, { id });
  }

  findOneByUsername(username: string) {
    return this.entityManager.findOneBy(User, { username });
  }

  async existByUsername(username: string) {
    const count = await this.entityManager.count(User, { where: { username } });

    return count > 0;
  }

  findById(ids: number[]) {
    return this.entityManager.find(User, { where: { id: In(ids) } });
  }

  existsById(id: number) {
    return this.entityManager.existsBy(User, { id });
  }

  async existsByIds(ids: number[]) {
    const users = await this.entityManager.find(User, {
      where: { id: In(ids) },
      select: { id: true },
    });
    const foundIds = users.map((el) => el.id);

    return ids.reduce<[number, boolean][]>((acc, curr) => {
      acc.push([curr, foundIds.includes(curr)]);
      return acc;
    }, []);
  }

  findUsersAvailablerForSharing(user: AuthUser) {
    return this.entityManager.find(User, { where: { id: Not(user.id) } });
  }
}

export { UserService };
