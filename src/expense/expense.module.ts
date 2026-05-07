import { Expense } from './entity/expense.entity';
import { ExpenseController } from './controller/expense.controller';
import { ExpenseCycleModule } from 'src/expense-cycle/expense-cycle.module';
import { ExpensePolicy } from './service/policy/expense.policy';
import { ExpenseService } from './service/expense.service';
import { ExpenseValidator } from './service/validation/expense.validator';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ExpenseCycleModule, TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpensePolicy, ExpenseValidator],
})
class ExpenseModule {}

export { ExpenseModule };
