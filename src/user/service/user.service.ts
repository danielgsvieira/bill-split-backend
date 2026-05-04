import { AuthUser } from 'src/auth/auth-user';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { ValidationException } from 'src/utils/exceptions/validation-exception';
import { In, Not, Repository } from 'typeorm';

@Injectable()
class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const usernameAlreadyExists = await this.userRepository.existsBy({
      username: dto.username,
    });

    if (usernameAlreadyExists) {
      throw new ValidationException({ username: [['alreadyExists']] });
    }

    const entity = this.userRepository.create(dto);

    return this.userRepository.save(entity);
  }

  findOneById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findById(ids: number[]) {
    return this.userRepository.find({ where: { id: In(ids) } });
  }

  existsById(id: number) {
    return this.userRepository.existsBy({ id });
  }

  findUsersAvailablerForSharing(user: AuthUser) {
    return this.userRepository.find({ where: { id: Not(user.id) } });
  }
}

export { UserService };
