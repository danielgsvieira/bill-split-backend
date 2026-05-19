import { ExpenseCycle } from './entity/expense-cycle.entity';
import { ExpenseCycleController } from './controller/expense-cycle.controller';
import { ExpenseCyclePolicy } from './service/policy/expense-cycle.policy';
import { ExpenseCycleService } from './service/expense-cycle.service';
import { ExpenseCycleUserBudget } from './entity/expense-cycle-user-budget.entity';
import { ExpenseCycleValidator } from './service/validation/expense-cycle.validator';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ExpenseCycle, ExpenseCycleUserBudget])],
  controllers: [ExpenseCycleController],
  providers: [ExpenseCycleService, ExpenseCyclePolicy, ExpenseCycleValidator],
  exports: [ExpenseCycleService],
})
class ExpenseCycleModule {}

export { ExpenseCycleModule };
