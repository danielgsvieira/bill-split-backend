import { ExpenseCycleService } from './expense-cycle.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ExpenseCycleService', () => {
  let service: ExpenseCycleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenseCycleService],
    }).compile();

    service = module.get<ExpenseCycleService>(ExpenseCycleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
