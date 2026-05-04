import { ExpenseCycle } from './entity/expense-cycle.entity';
import { ExpenseCycleController } from './controller/expense-cycle.controller';
import { ExpenseCyclePolicy } from './service/policy/expense-cycle.policy';
import { ExpenseCycleService } from './service/expense-cycle.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ExpenseCycle])],
  controllers: [ExpenseCycleController],
  providers: [ExpenseCycleService, ExpenseCyclePolicy],
})
class ExpenseCycleModule {}

export { ExpenseCycleModule };
