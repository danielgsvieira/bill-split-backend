import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
class HashService {
  private readonly rounds: number;

  constructor(configService: ConfigService) {
    this.rounds = Number.parseInt(configService.get<string>('HASHING_ROUNDS', '10'));
  }

  hash(value: string) {
    return bcrypt.hashSync(value, this.rounds);
  }

  compare(value: string, hash: string) {
    return bcrypt.compareSync(value, hash);
  }
}

export { HashService };
