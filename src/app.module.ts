import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './db/db.config';
import { ExpenseCycleModule } from './expense-cycle/expense-cycle.module';
import { ExpenseModule } from './expense/expense.module';
import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    UserModule,
    ExpenseCycleModule,
    ExpenseModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export { AppModule };
