import { ExpenseCycleController } from './expense-cycle.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('ExpenseCycleController', () => {
  let controller: ExpenseCycleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseCycleController],
    }).compile();

    controller = module.get<ExpenseCycleController>(ExpenseCycleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
